import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription, timer } from 'rxjs';
import { delayWhen, map, retryWhen, tap } from 'rxjs/operators';
import { AccountModel } from 'src/app/models/AccountModel';
import { SorResponse } from 'src/app/models/sor/SorResponse';
import { SorService } from 'src/app/services/backend/sor.service';
import { CachingService } from 'src/app/services/caching.service';
import { SorAccountTypeId } from 'src/app/enum/sor-enums/SorAccountTypeId';
import { SorSubscriptionPlans } from 'src/app/enum/sor-enums/SorSubscriptionPlans';
import { SubscriptionModel } from 'src/app/models/payment/SubscriptionModel';
import { Payment } from 'src/app/models/payment/Payment';
import { ProductIdsEnum } from 'src/app/enum/ProductIdsEnum';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-sor-account-validation',
  templateUrl: './sor-account-validation.component.html',
  styleUrls: ['./sor-account-validation.component.scss']
})
export class SorAccountValidationComponent implements OnInit, OnDestroy {
  sorErrorMSG: boolean;
  serviceDownMSG: boolean;
  sorAccount: any;
  $sub1: Subscription;

  constructor(
    private cachingService: CachingService,
    private sorService: SorService,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    if (this.$sub1) {
      this.$sub1.unsubscribe();
    }
  }

  ngOnInit() {
    console.log(SorAccountTypeId.LifeTime);
    const account = this.cachingService.getSession();
    const secret = this.cachingService.getSecret();
    const subscriptionId = AccountModel.isPrivilegedAccount(account.role)
      ? SorSubscriptionPlans.FiveStars
      : this.checkPlanBasedOnPayment();
    const accountTypeId = AccountModel.isPrivilegedAccount(account.role)
      ? SorAccountTypeId.LifeTime
      : SorAccountTypeId.OneMonth;
    const checkSorMemberPayload = [{ Email: account.email }];
    this.$sub1 = this.sorService.sorMembers(checkSorMemberPayload).subscribe(
      (sorMemberList: Array<any>) => {
        console.log(
          'TCL: SorAccountValidationComponent -> ngOnInit -> sorMemberList',
          sorMemberList
        );
        // member exist in SOR
        if (sorMemberList && sorMemberList.length > 0) {
          this.sorService.saveSorAccount(sorMemberList[0]);
          this.navigate();
        } else {
          this.sorCreateFlow(account, secret, subscriptionId, accountTypeId);
        }
      },
      sorMemberError => {
        console.log(
          'TCL: SorAccountValidationComponent -> ngOnInit -> sorMemberError',
          sorMemberError
        );
        if (
          sorMemberError.error['message'] ===
          'Service is down. Please try later'
        ) {
          this.serviceDownMSG = true;
        } else {
          this.sorErrorMSG = true;
        }
      }
    );
  }

  checkPlanBasedOnPayment(): string {
    const subscription: SubscriptionModel = this.cachingService.getSubscriptionCache();
    const payment: Payment = this.cachingService.getFirstPaymentCache();
    if (subscription) {
      return ProductIdsEnum.match(subscription.product.description);
    } else if (payment) {
      return ProductIdsEnum.match(
        payment.shoppingCart.products[0].product.description
      );
    }
    return SorSubscriptionPlans.Basic;
  }

  private navigate(): void {
    this.router.navigate(['']);
  }

  private sorCreateFlow(
    accountData: AccountModel,
    password: string,
    subscriptionId: string,
    accountTypeId: string
  ) {
    this.sorService
      .sorCreate(subscriptionId, accountData, password, accountTypeId)
      .subscribe(
        (sorResponse: SorResponse) => {
          console.log(
            'TCL: SignupComponent -> sorCreateFlow -> sorResponse',
            sorResponse
          );
          if (sorResponse && sorResponse.Account) {
            this.sorService.saveSorAccount(sorResponse.Account);
          }
          this.navigate();
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
