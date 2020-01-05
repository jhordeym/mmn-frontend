import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, timer } from 'rxjs';
import { delayWhen, map, retryWhen, tap } from 'rxjs/operators';
import { AccountStatus } from 'src/app/enum/AccountStatus';
import { AccountModel } from 'src/app/models/AccountModel';
import { Address } from 'src/app/models/Address';
import { SorResponse } from 'src/app/models/sor/SorResponse';
import { AccountService } from 'src/app/services/backend/account.service';
import { SorService } from 'src/app/services/backend/sor.service';
import { CachingService } from 'src/app/services/caching.service';
import { environment as ENV } from 'src/environments/environment';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  logo = ENV.imageLogoBig;

  countries_list = [];

  tabs = [
    {
      id: 'pills-lookup-tab',
      i18n: 'signup.tab1',
      contentId: 'pills-lookup',
      active: true,
      disabled: false,
      selected: true
    },
    {
      id: 'pills-account-tab',
      i18n: 'signup.tab2',
      contentId: 'pills-account',
      active: false,
      disabled: true,
      selected: false
    },
    {
      id: 'pills-address-tab',
      i18n: 'signup.tab3',
      contentId: 'pills-address',
      active: false,
      disabled: true,
      selected: false
    },
    {
      id: 'pills-confirmation-tab',
      i18n: 'signup.tab5',
      contentId: 'pills-confirmation',
      active: false,
      disabled: true,
      selected: false
    }
  ];

  inviteForm: any;
  signupForm: any;
  signupAddressForm: any;
  signupConfirmForm: any;

  referId: string = null;

  unoutorizedMessage = false;
  invalidTokenMSG = false;
  accountAlreadyExistsMSG = false;
  sorErrorMSG = false;

  continueAfterPayment = false;

  inviteToken = '';

  get invite() {
    return this.inviteForm.get('invite');
  }

  get name() {
    return this.signupForm.get('name');
  }

  get lastName() {
    return this.signupForm.get('lastName');
  }

  get birthday() {
    return this.signupForm.get('birthday');
  }

  get email() {
    return this.signupForm.get('email');
  }

  get phone() {
    return this.signupForm.get('phone');
  }

  get password() {
    return this.signupForm.get('password');
  }

  get confirmPassword() {
    return this.signupForm.get('confirmPassword');
  }

  // address
  get street() {
    return this.signupAddressForm.get('street');
  }

  get city() {
    return this.signupAddressForm.get('city');
  }

  get state() {
    return this.signupAddressForm.get('state');
  }

  get zip() {
    return this.signupAddressForm.get('zip');
  }
  get country() {
    return this.signupAddressForm.get('country');
  }

  // confirmation
  get acceptedTerms() {
    return this.signupConfirmForm.get('acceptedTerms');
  }

  get subscribeNewsletter() {
    return this.signupConfirmForm.get('subscribeNewsletter');
  }

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService,
    private sorService: SorService,
    private cachingService: CachingService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    const countriesList = this.sorService.getCountriesList();
    this.countries_list = Object.values(countriesList);

    this.route.queryParams.subscribe(params => {
      // tslint:disable-next-line: no-string-literal
      this.inviteToken = params['inviteToken'];
    });

    this.inviteForm = this.fb.group({
      invite: [
        this.inviteToken,
        [
          Validators.required,
          Validators.minLength(48),
          Validators.maxLength(48)
        ]
      ]
    });

    this.signupForm = this.fb.group(
      {
        name: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        birthday: ['', Validators.required],
        email: ['', [Validators.required, Validators.minLength(6)]],
        phone: ['', [Validators.required, Validators.minLength(6)]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]]
      },
      { validators: [this.validatePasswords, this.validateDate] }
    );

    /** DEBUG */
    this.signupForm.valueChanges.subscribe((data: any) => console.debug(data));

    this.signupAddressForm = this.fb.group({
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zip: ['', [Validators.required]],
      country: ['', [Validators.required]]
    });

    this.signupConfirmForm = this.fb.group(
      {
        acceptedTerms: [null, [Validators.required]],
        subscribeNewsletter: [null]
      },
      { validators: [this.validateTerms] }
    );
  }

  validateDate(group: AbstractControl) {
    const date = group.get('birthday').value;
    const birthYear = date.year;
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear > 18 ? null : { invalid: true };
  }

  validateTerms(group: AbstractControl) {
    const pass = group.get('acceptedTerms').value;
    return pass === true ? null : { invalid: true };
  }

  validatePasswords(group: AbstractControl) {
    const pass = group.get('password').value;
    const confirm = group.get('confirmPassword').value;
    return pass === confirm ? null : { invalid: true };
  }

  /** ACTUAL METHODS */

  validateBeforeSubmit() {
    if (this.signupForm.valid && this.signupAddressForm.valid) {
      const address = new Address();
      address.street = this.street.value;
      address.city = this.city.value;
      address.state = this.state.value;
      address.country = this.country.value;
      address.zip = this.zip.value;
      const account = new AccountModel();
      account.name = this.name.value;
      account.lastName = this.lastName.value;
      account.email = this.email.value;
      account.phone = this.phone.value;
      account.password = this.password.value;
      const birthDate = new Date(this.birthday.value);
      account.birthDate = birthDate;
      account.address = address;
      account.accountStatus = AccountStatus.New;
      console.log(
        'TCL: SignupComponent -> validateBeforeSubmit -> account',
        account
      );
      this.doSignup(account);
    }
  }

  // step 1
  verifyToken() {
    this.accountService.verifyInviteToken(this.invite.value).subscribe(
      (parentId: string) => {
        console.log(
          'TCL: SignupComponent -> verifyToken -> parentId',
          parentId
        );
        if (parentId) {
          this.referId = parentId;
          this.saveStep(1, parentId);
          this.goTo(1);
        } else {
          this.invalidTokenMSG = true;
        }
      },
      verifyTokenError => {
        console.log(
          'TCL: SignupComponent -> verifyToken -> verifyTokenError',
          verifyTokenError
        );
        this.invalidTokenMSG = true;
      }
    );
  }

  // step 2
  verifyAccount() {
    const account = new AccountModel(this.signupForm.values);
    console.log('TCL: SignupComponent -> verifyAccount -> account', account);
    this.goTo(2);
  }

  // step 3
  verifyAccountAddress() {
    const address = new Address(this.signupAddressForm.values);
    console.log(
      'TCL: SignupComponent -> verifyAccountAddress -> address',
      address
    );
    this.goTo(3);
  }

  getStep(step: number) {
    return this.cachingService.getRegisterStep(step);
  }

  saveStep(step: number, data: any) {
    return this.cachingService.saveRegisterStep(step, data);
  }

  goTo(step: number) {
    const tab = this.tabs[step];
    const element = document.getElementById(tab.id);
    element.classList.remove('disabled');
    element.click();
  }

  private doSignup(account: AccountModel): void {
    this.accountService.signup(account).subscribe(
      (accountData: AccountModel) => {
        console.log(
          'TCL: SignupComponent -> doSignup -> accountData',
          accountData
        );
        if (accountData) {
          this.cachingService.saveSession(accountData);
          this.accountAlreadyExistsMSG = false;
          this.sorCreateFlow(accountData);
        }
      },
      accountError => {
        this.accountAlreadyExistsMSG = true;
        console.log(
          'TCL: SignupComponent -> doSignup -> accountError',
          accountError
        );
      }
    );
  }

  private sorCreateFlow(accountData: AccountModel) {
    this.sorService
      .sorCreate('0', accountData, this.password.value)
      .pipe(
        map((sorResponse: SorResponse) => {
          console.log(
            'TCL: SignupComponent -> sorCreateFlow -> map -> sorResponse',
            sorResponse
          );
          if (
            sorResponse &&
            this.sorService.createErrorMsgs != sorResponse['Message']
          ) {
            return sorResponse;
          } else {
            throw sorResponse;
          }
        }),
        retryWhen((errors: Observable<any>) =>
          errors.pipe(
            // log error
            tap(sorError => {
              console.log(
                'TCL: SignupComponent -> sorCreateFlow -> retryWhen -> sorError',
                sorError
              );
              this.sorErrorMSG = true;
            }),
            // delay 1sec
            delayWhen(val => timer(5000))
          )
        )
      )
      .subscribe(
        (sorResponse: SorResponse) => {
          console.log(
            'TCL: SignupComponent -> sorCreateFlow -> sorResponse',
            sorResponse
          );
          this.router.navigate(['payment-validation']);
        },
        sorError => {
          console.log(
            'TCL: SignupComponent -> sorCreateFlow -> sorError',
            sorError
          );
          this.sorErrorMSG = true;
        }
      );
  }
}
