import { FormFields, FormPages } from '@customTypes/enums';
import { Form } from './FormTemplate';
import { validator } from '@utils/validator';
import {
  emailValidationCb,
  firstNameValidationCb,
  lastNameValidationCb,
  passwordValidationCb,
  streetValidationCb,
  cityValidationCb,
  countryValidationCb,
  postalCodeValidationCb,
  ageValidationCb,
} from '@utils/customValidationCb';

export class RegistrationForm extends Form {
  constructor() {
    super(FormPages.registration);
    this.buildRegistrationForm();
  }

  // eslint-disable-next-line max-lines-per-function
  private buildRegistrationForm(): void {
    this.addNewValidatedField(
      FormFields.firstName,
      'text',
      `${FormFields.firstName}*`,
      validator.inputString,
      firstNameValidationCb,
    )
      .addNewValidatedField(
        FormFields.lastName,
        'text',
        `${FormFields.lastName}*`,
        validator.inputString,
        lastNameValidationCb,
      )
      .addNewDateField(FormFields.birthDate, 'date', `${FormFields.birthDate}*`, validator.inputString, ageValidationCb)
      .addNewValidatedField(
        FormFields.country,
        'text',
        `${FormFields.country}*`,
        validator.inputString,
        countryValidationCb,
        'Russia',
      )
      .addNewValidatedField(FormFields.city, 'text', `${FormFields.city}*`, validator.inputString, cityValidationCb)
      .addNewValidatedField(
        FormFields.street,
        'text',
        `${FormFields.street}*`,
        validator.inputString,
        streetValidationCb,
      )
      .addNewValidatedField(
        FormFields.postalCode,
        'text',
        `${FormFields.postalCode}*`,
        validator.inputString,
        postalCodeValidationCb,
      )
      .addNewValidatedField(FormFields.email, 'text', `${FormFields.email}*`, validator.inputString, emailValidationCb)
      .addNewValidatedField(
        FormFields.password,
        'password',
        `${FormFields.password}*`,
        validator.inputString,
        passwordValidationCb,
      )
      .addNewCtrlField(
        FormFields.showPw,
        'checkbox',
        'Show Password',
        'click',
        this.showPassword.bind(this, '#registrationPassword'),
      )
      .addSubmitListener(() => {
        // TODO add submit handler and disable the button if there are errors
        console.log('submited!');
      })
      .buildForm();
  }
}
