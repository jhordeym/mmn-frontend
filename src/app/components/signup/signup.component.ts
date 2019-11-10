import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import {
  FormBuilder,
  Validators,
  FormGroup,
  AbstractControl
} from '@angular/forms';
import { Router } from '@angular/router';
import { Account } from 'src/app/models/Account';
import { Address } from 'src/app/models/Address';
import { AccountStatus } from 'src/app/models/enum/AccountStatus';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
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
      id: 'pills-billing-tab',
      i18n: 'signup.tab4',
      contentId: 'pills-billing',
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

  signupForm: any;
  signupAddressForm: any;
  signupBillingForm: any;
  signupConfirmForm: any;

  unoutorizedMessage = false;

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

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private route: Router
  ) {
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

    this.signupAddressForm = this.fb.group({
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zip: ['', [Validators.required]],
      country: ['', [Validators.required]]
    });

    this.signupBillingForm = this.fb.group({});

    this.signupConfirmForm = this.fb.group(
      {
        acceptedTerms: [null, [Validators.required]]
      },
      { validators: [this.validateTerms] }
    );
  }

  ngOnInit() {
    // this.signupForm.valueChanges.subscribe(console.log);
    // this.signupAddressForm.valueChanges.subscribe(console.log);
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

  getStep(n: number) {
    return this.accountService.getRegisterStep(n);
  }

  validateBeforeSubmit() {
    if (this.signupForm.valid && this.signupAddressForm.valid) {
      const address = new Address();
      address.street = this.street.value;
      address.city = this.city.value;
      address.state = this.state.value;
      address.zip = this.zip.value;
      address.country = this.country.value;
      const account = new Account();
      account.name = this.name.value;
      account.lastName = this.lastName.value;
      account.email = this.email.value;
      account.phone = this.phone.value;
      account.password = this.password.value;
      const birthday = new Date();
      birthday.setFullYear(
        this.birthday.value.year,
        this.birthday.value.month,
        this.birthday.value.number
      );
      account.birthday = birthday;
      account.address = address;
      account.accountStatus = AccountStatus.New;
      console.log(account);
      this.doSignup(account);
    }
  }

  goTo(step: number) {
    const t = this.tabs[step];
    const element = document.getElementById(t.id);
    element.classList.remove('disabled');
    element.click();
  }

  doSignup(account: Account) {
    this.accountService.signup(account).subscribe(
      data => {
        this.unoutorizedMessage = false;
        this.route.navigate(['']);
        // redirect to home page
        console.log(data);
      },
      error => {
        this.unoutorizedMessage = true;
        console.log(error);
      }
    );
  }
}
