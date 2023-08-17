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

import { signUp } from '@utils/apiRequests';
import { InvalidCredentialsError } from '@commercetools/platform-sdk';
import { safeQuerySelector } from '@utils/safeQuerySelector';
import { apiClient } from '@utils/ApiClient';

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
      .addNewValidatedField(
        FormFields.birthDate,
        'date',
        `${FormFields.birthDate}*`,
        validator.inputString,
        ageValidationCb,
      )
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
      .buildForm();
    this.submitBtn.getNode().addEventListener('click', this.submitRegistration.bind(this));
  }

  private submitRegistration(e: Event): void {
    e.preventDefault();
    if (!this.checkAllFieldsCorrectness()) {
      const email = safeQuerySelector<HTMLInputElement>('#registrationEmail').value;
      const password = safeQuerySelector<HTMLInputElement>('#registrationPassword').value;
      const firstName = safeQuerySelector<HTMLInputElement>('#registrationFirst-name').value;
      const lastName = safeQuerySelector<HTMLInputElement>('#registrationLast-name').value;
      const birthDate = safeQuerySelector<HTMLInputElement>('#registrationBirth-date').value;
      const country = 'RU';
      const city = safeQuerySelector<HTMLInputElement>('#registrationCity').value;
      const street = safeQuerySelector<HTMLInputElement>('#registrationStreet').value;
      const postalCode = safeQuerySelector<HTMLInputElement>('#registrationPostal-code').value;

      signUp(email, password, firstName, lastName, birthDate, country, city, street, postalCode)
        .then(async () => {
          await apiClient.getNewPassFlowToken(email, password).catch((err: Error) => console.log(err.message));
          window.location.hash = '#/';
        })
        .catch((e: InvalidCredentialsError) => {
          console.log(e.code, e.message);
          this.errAuthMessage.setTextContent(e.message);
          return null;
        });
    }
  }
}
