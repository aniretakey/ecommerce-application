export const MIN_PASSWORD_LENGTH = 8;
export const MIN_LENGTH = 1;
export const MIN_POSTAL_CODE_LENGTH = 6;
export const MAX_POSTAL_CODE_LENGTH = 6;
export const COUNTRY_CODE: Record<string, string> = {
  Russia: 'RU',
};

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
  setShipping = 'set-shipping',
  setBilling = 'set-billing',
}

export enum FormPages {
  login = 'login',
  registration = 'registration',
  userProfile = 'userProfile',
}

export enum RedirectMessage {
  login = 'Have not account yet?',
  registration = 'Already have an account?',
  userProfile = '',
}

export enum FormSubmitBtn {
  login = 'Sign In',
  registration = 'Sign Up',
  userProfile = 'Save',
}

export enum FormRedirectBtn {
  login = 'Sign Up',
  registration = 'Sign In',
  userProfile = '',
}

export enum UserProfileButtons {
  editPersonalInfo = 'edit-personal-info-btn',
  editPassword = 'edit-password-btn',
  addAddress = 'add-address-btn',
  editAddress = 'edit-address-btn',
  deleteAddress = 'delete-address-btn',
}
