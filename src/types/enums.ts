export const MIN_PASSWORD_LENGTH = 8;
export const MIN_LENGTH = 1;
export const MIN_POSTAL_CODE_LENGTH = 6;
export const MAX_POSTAL_CODE_LENGTH = 6;
export const CATALOG_CARDS_NUM = 6;

export enum FormFields {
  email = 'Email',
  password = 'Password',
  firstName = 'First-name',
  lastName = 'Last-name',
  birthDate = 'Birth-date',
  street = 'Street',
  city = 'City',
  country = 'Country',
  postalCode = 'Postal-code',
  showPw = 'show-pw',
  saveOneAddress = 'save-one-address',
  setDefaultShipping = 'set-default-shipping',
  setDefaultBilling = 'set-default-billing',
}

export enum FormPages {
  login = 'login',
  registration = 'registration',
}

export enum RedirectMessage {
  login = 'Have not account yet?',
  registration = 'Already have an account?',
}

export enum FormSubmitBtn {
  login = 'Sign In',
  registration = 'Sign Up',
}

export enum FormRedirectBtn {
  login = 'Sign Up',
  registration = 'Sign In',
}
