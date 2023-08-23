import { FormFields, FormPages } from '@customTypes/enums';
import { Form } from './FormTemplate';
import { validator } from '@utils/validator';
import {
  streetValidationCb,
  cityValidationCb,
  countryValidationCb,
  postalCodeValidationCb,
} from '@utils/customValidationCb';
import { safeQuerySelector } from '@utils/safeQuerySelector';
import { AddressTypes } from '@customTypes/types';
import { Address } from '@commercetools/platform-sdk';

export class EditAddressForm extends Form {
  private userId;
  private userVersion;

  constructor(userId: string, userVersion: number, addressInfo?: Address & AddressTypes) {
    super(FormPages.userProfile, false);
    this.userId = userId;
    this.userVersion = userVersion;
    this.buildEditAddressForm(addressInfo);
  }

  // eslint-disable-next-line max-lines-per-function
  private buildEditAddressForm(addressInfo?: Address & AddressTypes): void {
    this.addNewValidatedField(
      FormFields.country,
      'text',
      `${FormFields.country}*`,
      validator.inputString,
      countryValidationCb,
      'Russia',
    )
      .addNewValidatedField(
        FormFields.city,
        'text',
        `${FormFields.city}*`,
        validator.inputString,
        cityValidationCb,
        addressInfo ? addressInfo.city : '',
      )
      .addNewValidatedField(
        FormFields.street,
        'text',
        `${FormFields.street}*`,
        validator.inputString,
        streetValidationCb,
        addressInfo ? addressInfo.streetName : '',
      )
      .addNewValidatedField(
        FormFields.postalCode,
        'text',
        `${FormFields.postalCode}*`,
        validator.inputString,
        postalCodeValidationCb,
        addressInfo ? addressInfo.postalCode : '',
      )
      .addNewCtrlField(
        FormFields.setDefaultShipping,
        'checkbox',
        'Set as shipping address',
        undefined,
        undefined,
        addressInfo?.isShippingAddress ?? false,
      )
      .addNewCtrlField(
        FormFields.setDefaultBilling,
        'checkbox',
        'Set as billing address',
        undefined,
        undefined,
        addressInfo?.isBillingAddress ?? false,
      )
      .addNewCtrlField(
        FormFields.setDefaultShipping,
        'checkbox',
        'Set as default shipping address',
        undefined,
        undefined,
        addressInfo?.isDefaultShippingAddress ?? false,
      )
      .addNewCtrlField(
        FormFields.setDefaultBilling,
        'checkbox',
        'Set as default billing address',
        undefined,
        undefined,
        addressInfo?.isDefaultBillingAddress ?? false,
      )
      .buildForm();
    this.submitBtn
      .getNode()
      .addEventListener('click', addressInfo ? this.editAddress.bind(this) : this.addAddress.bind(this));

    addressInfo
      ? this.form
          .getNode()
          .querySelectorAll('.form-field-container')
          .forEach((field) => field.setAttribute('data-valid', 'true'))
      : safeQuerySelector('.userprofile__country-container', this.form.getNode()).setAttribute('data-valid', 'true');
  }

  private editAddress(e: Event): void {
    e.preventDefault();
    if (!this.checkAllFieldsCorrectness()) {
      console.log('edit');
    }
  }

  private addAddress(e: Event): void {
    e.preventDefault();
    if (!this.checkAllFieldsCorrectness()) {
      console.log('add');
    }
  }
}
