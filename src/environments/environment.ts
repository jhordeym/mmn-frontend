const APP_BASE_URL = 'http://localhost:8080/api/';
const IMG_PATH = 'assets/img/';

const USE_MICROSERVICE = false;
// each microservices individually
const LANG_BASE_URL = 'http://localhost:8181/';
const ACC_BASE_URL = 'http://localhost:8182/';
const PAYMENT_BASE_URL = 'http://localhost:8182/';
const MAIL_BASE_URL = '...';
const SOR_BASE_URL = 'http://localhost:8190/';

const SOR_REDIRECT_URL =
  'http://memberstravined.saveonuat.com/vacationclub/logincheck.aspx?Token=';

export const environment = {
  mode: 'Dev',
  production: false,
  useMock: true,

  sorRedirectUrl: SOR_REDIRECT_URL,

  // API
  languagePackServiceURL:
    (USE_MICROSERVICE ? LANG_BASE_URL : APP_BASE_URL) + 'translations/lang',
  accountServiceURL:
    (USE_MICROSERVICE ? ACC_BASE_URL : APP_BASE_URL) + 'accounts/accounts',
  paymentServiceURL:
    (USE_MICROSERVICE ? PAYMENT_BASE_URL : APP_BASE_URL) + 'payments/payments',
  mailServiceURL: (USE_MICROSERVICE ? MAIL_BASE_URL : APP_BASE_URL) + 'mail/',
  reservationServiceURL:
    (USE_MICROSERVICE ? LANG_BASE_URL : APP_BASE_URL) + 'reservation/sor',

  // Images
  imageBg: IMG_PATH + 'bg-vector.png',
  imageLogoBig: IMG_PATH + 'logo-big.jpeg',
  imageLogoSmall: IMG_PATH + 'logo-small.png',
  myTripLogo: IMG_PATH + 'myTrip360.png',

  imgCar: IMG_PATH + 'img-car.jpg',
  imgCruises: IMG_PATH + 'img-cruises.jpg',
  imgFlight: IMG_PATH + 'img-flight.jpg',
  imgHome: IMG_PATH + 'img-home.jpg',
  imgHotel: IMG_PATH + 'img-hotel.jpg',
  imgMarketplace: IMG_PATH + 'img-marketplace.jpg',
  imgWeeks: IMG_PATH + 'img-weeks.jpg'
};
