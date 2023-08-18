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
import { InvalidCredentialsError, BaseAddress, MyCustomerDraft } from '@commercetools/platform-sdk';
import { safeQuerySelector } from '@utils/safeQuerySelector';
import { apiClient } from '@utils/ApiClient';
import { DefaultAddresses } from '@customTypes/types';

const COUNTRY_CODE: Record<string, string> = {
  Russia: 'RU',
};

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
      .addNewLabel('shipping-address', 'Shipping Address')
      .addNewCtrlField(
        FormFields.saveOneAddress,
        'checkbox',
        'Use the same address for billing and shipping',
        'change',
        (e) => {
          const target = e.target;
          if (target instanceof HTMLInputElement) {
            const isChecked = target.checked;
            this.disabledBillingAddressFields(isChecked);
            this.setValidAttrOfBillingAddressFields(isChecked);
          }
        },
      )
      .addNewValidatedField(
        FormFields.country,
        'text',
        `${FormFields.country}*`,
        validator.inputString,
        countryValidationCb,
        'Russia',
        'shipping',
      )
      .addNewValidatedField(
        FormFields.city,
        'text',
        `${FormFields.city}*`,
        validator.inputString,
        cityValidationCb,
        '',
        'shipping',
      )
      .addNewValidatedField(
        FormFields.street,
        'text',
        `${FormFields.street}*`,
        validator.inputString,
        streetValidationCb,
        '',
        'shipping',
      )
      .addNewValidatedField(
        FormFields.postalCode,
        'text',
        `${FormFields.postalCode}*`,
        validator.inputString,
        postalCodeValidationCb,
        '',
        'shipping',
      )
      .addNewCtrlField(FormFields.setDefaultShipping, 'checkbox', 'Set as default shipping address')
      .addNewLabel('billing-address', 'Billing Address')
      .addNewValidatedField(
        FormFields.country,
        'text',
        `${FormFields.country}*`,
        validator.inputString,
        countryValidationCb,
        'Russia',
        'billing',
      )
      .addNewValidatedField(
        FormFields.city,
        'text',
        `${FormFields.city}*`,
        validator.inputString,
        cityValidationCb,
        '',
        'billing',
      )
      .addNewValidatedField(
        FormFields.street,
        'text',
        `${FormFields.street}*`,
        validator.inputString,
        streetValidationCb,
        '',
        'billing',
      )
      .addNewValidatedField(
        FormFields.postalCode,
        'text',
        `${FormFields.postalCode}*`,
        validator.inputString,
        postalCodeValidationCb,
        '',
        'billing',
      )
      .addNewCtrlField(FormFields.setDefaultBilling, 'checkbox', 'Set as default billing address', 'change')
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
      const isOneAddress = safeQuerySelector<HTMLInputElement>(
        '.registration__save-one-address-container input',
      ).checked;
      const addresses: BaseAddress[] = this.getAddresses(isOneAddress);
      const defaultAddresses = this.getDefaultAddresses(isOneAddress);
      const customer: MyCustomerDraft = {
        email,
        password,
        firstName,
        lastName,
        dateOfBirth: birthDate,
        addresses,
        ...defaultAddresses,
      };
      signUp(customer)
        .then(async () => {
          await apiClient.getNewPassFlowToken(email, password).catch((err: Error) => console.log(err.message));
          const registrPage = safeQuerySelector<HTMLFormElement>('#registration');
          registrPage.innerHTML = `<h3 class='success-message'>You are succesfully registered!</h3>
      <button class='btn' id='ok-btn'>Ok</button>`;
          const okBtn = safeQuerySelector<HTMLButtonElement>('#ok-btn');
          okBtn.addEventListener('click', () => {
            window.location.hash = '#/';
          });
        })
        .catch((e: InvalidCredentialsError) => {
          this.errAuthMessage.setTextContent(e.message);
          return null;
        });
    }
  }

  private getAddresses(isOneAddress: boolean): BaseAddress[] {
    const addresses: BaseAddress[] = [];

    const shippingAddressFields = this.getAddressFields('shipping');
    const countryName = shippingAddressFields.country.value;
    const countryCode = COUNTRY_CODE[countryName];
    if (!countryCode) {
      throw new Error('countryCode does not exist');
    }
    const shippingAddress: BaseAddress = {
      country: countryCode,
      city: shippingAddressFields.city.value,
      streetName: shippingAddressFields.street.value,
      postalCode: shippingAddressFields.postalCode.value,
    };
    addresses.push(shippingAddress);
    if (!isOneAddress) {
      const billingAddressFields = this.getAddressFields('billing');
      const billingAddress: BaseAddress = {
        country: countryCode,
        city: billingAddressFields.city.value,
        streetName: billingAddressFields.street.value,
        postalCode: billingAddressFields.postalCode.value,
      };
      addresses.push(billingAddress);
    }

    return addresses;
  }

  private getDefaultAddresses(isOneAddress: boolean): DefaultAddresses {
    const defaultAddresses: DefaultAddresses = {};
    const iSDefaultShippingAddress = safeQuerySelector<HTMLInputElement>(
      '.registration__set-default-shipping-container input',
    ).checked;
    const iSDefaultBillingAddress = safeQuerySelector<HTMLInputElement>(
      '.registration__set-default-billing-container input',
    ).checked;
    if (iSDefaultShippingAddress) {
      defaultAddresses.defaultShippingAddress = 0;
      if (isOneAddress) {
        defaultAddresses.defaultBillingAddress = 0;
      }
    }
    if (!isOneAddress && iSDefaultBillingAddress) {
      defaultAddresses.defaultBillingAddress = 1;
    }
    return defaultAddresses;
  }

  private disabledBillingAddressFields(isDisabled: boolean): void {
    const billingAddressFields = this.getAddressFields('billing');
    Object.values(billingAddressFields).forEach((field) => {
      field.disabled = isDisabled;
    });
  }

  private setValidAttrOfBillingAddressFields(isDisabled: boolean): void {
    const { city, street, postalCode } = this.getAddressFields('billing');
    city.parentElement?.setAttribute('data-valid', `${isDisabled}`);
    street.parentElement?.setAttribute('data-valid', `${isDisabled}`);
    postalCode.parentElement?.setAttribute('data-valid', `${isDisabled}`);
    city.value = '';
    street.value = '';
    postalCode.value = '';
  }

  private getAddressFields(addressType: string): {
    country: HTMLInputElement;
    city: HTMLInputElement;
    street: HTMLInputElement;
    postalCode: HTMLInputElement;
    defaultAddress: HTMLInputElement;
  } {
    const country = safeQuerySelector<HTMLInputElement>(`.registration__country-${addressType}-container input`);
    const city = safeQuerySelector<HTMLInputElement>(`.registration__city-${addressType}-container input`);
    const street = safeQuerySelector<HTMLInputElement>(`.registration__street-${addressType}-container input`);
    const postalCode = safeQuerySelector<HTMLInputElement>(`.registration__postal-code-${addressType}-container input`);
    const defaultAddress = safeQuerySelector<HTMLInputElement>(
      `.registration__set-default-${addressType}-container input`,
    );

    return { country, city, street, postalCode, defaultAddress };
  }
}
