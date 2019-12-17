import { Component, OnInit, ViewChild } from '@angular/core';
import { environment as ENV } from 'src/environments/environment';
import { SorService } from 'src/app/services/sor.service';
import { AccountService } from 'src/app/services/account.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { Account } from 'src/app/models/Account';

export class Card {
  public constructor(public img, public title, public text, public link) {}
}

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss']
})
export class ProductsPageComponent implements OnInit {
  @ViewChild(ModalComponent) modalElement: ModalComponent;
  modalTitle = "";
  modalContent = "";

  logo = ENV.myTripLogo;
  account : Account;
  cards = new Array<Card>();
  constructor(
    private sorService: SorService,
    private accountService: AccountService) {
    this.cards.push(
      new Card(
        ENV.imgHotel,
        'products.hotel.title',
        'products.hotel.text',
        '%2Frentals%2F'
      ),
      new Card(
        ENV.imgFlight,
        'products.flight.title',
        'products.flight.text',
        '%2Ftours%2F'
      ),
      new Card(
        ENV.imgCar,
        'products.car.title',
        'products.car.text',
        '%2Fcars%2F'
      ),
      new Card(
        ENV.imgCruises,
        'products.cruises.title',
        'products.cruises.text',
        '%2Fcruises%2F'
      ),
      new Card(
        ENV.imgHome,
        'products.home.title',
        'products.home.text',
        '%2Fsupplements%2F'
      ),
      new Card(
        ENV.imgWeeks,
        'products.weeks.title',
        'products.weeks.text',
        '%2Fweeks%2F'
      )
    );
  }

  ngOnInit() {
    this.account = this.accountService.getSession();
  }

  navigateTo(cardLink: string) {
    this.modalTitle = "Loading ..."
    this.modalContent = "<div style=\"text-align:center\" class=\"spinner-border text-primary\" role=\"status\">\r\n  <span class=\"sr-only\">Loading...<\/span>\r\n<\/div>"

    this.modalElement.open();
    const subscriptionId = '0';
    this.sorService.fetchTokenAndNavigate(subscriptionId, this.account, cardLink)
    .then(callingResult => {
      if(callingResult === 'success') {
        this.modalTitle = "Redirecting to MyTrip360º...";
        this.modalContent = "Redirecting to MyTrip360º, a new page should pop up soon!";
      }
    })
    .catch(error => {
      this.modalTitle = "Error connecting to MyTrip360º";
      this.modalContent = "<p>Error connecting to MyTrip360º. Please contact our support team.</p>";
      this.modalContent += ""
    });
  }
}
