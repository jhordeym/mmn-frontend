const APP_BASE_URL = 'http://localhost:8080/api/';
const IMG_PATH = 'assets/img/';

const USE_MICROSERVICE = false;
// each microservices individually
const LANG_BASE_URL = 'http://localhost:8181/';
const ACC_BASE_URL = 'http://localhost:8182/';
const PAYMENT_BASE_URL = 'http://localhost:8182/';

export const environment = {
  mode: 'Dev',
  production: false,
  useMock: true,

  // API
  languagePackServiceURL:
    (USE_MICROSERVICE ? LANG_BASE_URL : APP_BASE_URL) + 'lang',
  accountServiceURL:
    (USE_MICROSERVICE ? ACC_BASE_URL : APP_BASE_URL) + 'accounts',
  paymentServiceURL:
    (USE_MICROSERVICE ? PAYMENT_BASE_URL : APP_BASE_URL) + 'payments',

  // Images
  imageBg: IMG_PATH + 'bg-vector.png',
  imageLogoBig: IMG_PATH + 'logo-big.jpeg',
  imageLogoSmall: IMG_PATH + 'logo-small.png'
};
