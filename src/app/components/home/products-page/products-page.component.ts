import { Component, OnInit } from '@angular/core';
import { environment as ENV } from 'src/environments/environment';
import { SorService } from 'src/app/services/sor.service';

export class Card {
  public constructor(public img, public title, public text, public link) {}
}

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss']
})
export class ProductsPageComponent implements OnInit {
  logo = ENV.myTripLogo;
  cards = new Array<Card>();
  constructor(private sorService: SorService) {
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

  ngOnInit() {}

  navigateTo(cardLink) {
    this.sorService.fetchTokenAndNavigate(cardLink);
  }
}
