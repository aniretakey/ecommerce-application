import { COUNTRY_CODE, FormFields, FormPages } from '@customTypes/enums';
import { Form } from './FormTemplate';
import { validator } from '@utils/validator';
import {
  streetValidationCb,
  cityValidationCb,
  countryValidationCb,
  postalCodeValidationCb,
} from '@utils/customValidationCb';
import { safeQuerySelector } from '@utils/safeQuerySelector';
import { AddressTypes, EditForm, ActionsForUpdateAddressTypes } from '@customTypes/types';
import { Address } from '@commercetools/platform-sdk';
import { addCustomerAddress, setAddressTypes, updateCustomerAddress } from '@utils/apiRequests';

export class EditAddressForm extends Form implements EditForm {
  private userVersion;
  private addressInfo;

  constructor(userVersion: number, addressInfo?: Address & AddressTypes) {
    super(FormPages.userProfile, false);
    this.userVersion = userVersion;
    this.addressInfo = addressInfo;
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
        FormFields.setShipping,
        'checkbox',
        'Set as shipping address',
        'change',
        () => this.switchDisabledState('#userProfileset-default-shipping'),
        addressInfo?.isShippingAddress ?? false,
      )
      .addNewCtrlField(
        FormFields.setBilling,
        'checkbox',
        'Set as billing address',
        'change',
        () => this.switchDisabledState('#userProfileset-default-billing'),
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
    if (!addressInfo?.isShippingAddress) {
      safeQuerySelector<HTMLInputElement>('#userProfileset-default-shipping', this.form.getNode()).disabled = true;
    }
    if (!addressInfo?.isBillingAddress) {
      safeQuerySelector<HTMLInputElement>('#userProfileset-default-billing', this.form.getNode()).disabled = true;
    }

    addressInfo
      ? this.form
          .getNode()
          .querySelectorAll('.form-field-container')
          .forEach((field) => field.setAttribute('data-valid', 'true'))
      : safeQuerySelector('.userprofile__country-container', this.form.getNode()).setAttribute('data-valid', 'true');
  }

  public async editInfo(e: Event): Promise<void> {
    e.preventDefault();
    if (!this.checkAllFieldsCorrectness()) {
      const newAddressInfo = this.getAddressInfo();
      const newAddressTypes = this.getAddressTypesInfo();
      const addressId = this.addressInfo?.id;
      addressId
        ? await this.editAddress(addressId, newAddressInfo, newAddressTypes)
        : await this.addAddress(newAddressInfo, newAddressTypes);
    } else {
      throw new Error('Data is incorrect');
    }
  }

  private async editAddress(addressId: string, newAddressInfo: Address, newAddressTypes: AddressTypes): Promise<void> {
    await updateCustomerAddress(this.userVersion, addressId, newAddressInfo)
      .then((data) => {
        const actions = this.addActionsForUpdateTypes(newAddressTypes);
        if (actions.length > 0) {
          return setAddressTypes(data.body.version, addressId, actions);
        }
      })
      .catch((e: Error) => {
        throw new Error(e.message);
      });
  }

  private async addAddress(newAddressInfo: Address, newAddressTypes: AddressTypes): Promise<void> {
    await addCustomerAddress(this.userVersion, newAddressInfo)
      .then((data) => {
        const actions = this.addActionsForAddTypes(newAddressTypes);
        const addressId = data.body.addresses.at(-1)?.id;
        if (actions.length > 0 && addressId) {
          return setAddressTypes(data.body.version, addressId, actions);
        }
      })
      .catch((e: Error) => {
        throw new Error(e.message);
      });
  }

  private getAddressInfo(): Address {
    const countryName = safeQuerySelector<HTMLInputElement>(`.userprofile__country-container input`).value;
    const country = COUNTRY_CODE[countryName];
    if (!country) {
      throw new Error('Code of country does not exist');
    }
    const city = safeQuerySelector<HTMLInputElement>(`.userprofile__city-container input`).value;
    const streetName = safeQuerySelector<HTMLInputElement>(`.userprofile__street-container input`).value;
    const postalCode = safeQuerySelector<HTMLInputElement>(`.userprofile__postal-code-container input`).value;

    return { country, city, streetName, postalCode };
  }

  private getAddressTypesInfo(): AddressTypes {
    const isBillingAddress = safeQuerySelector<HTMLInputElement>(`.userprofile__set-billing-container input`).checked;
    const isShippingAddress = safeQuerySelector<HTMLInputElement>(`.userprofile__set-shipping-container input`).checked;
    const isDefaultBillingAddress = safeQuerySelector<HTMLInputElement>(
      `.userprofile__set-default-billing-container input`,
    ).checked;
    const isDefaultShippingAddress = safeQuerySelector<HTMLInputElement>(
      `.userprofile__set-default-shipping-container input`,
    ).checked;

    return { isBillingAddress, isShippingAddress, isDefaultBillingAddress, isDefaultShippingAddress };
  }

  private addActionsForUpdateTypes(newAddressTypes: AddressTypes): ActionsForUpdateAddressTypes['action'][] {
    const actions: ActionsForUpdateAddressTypes['action'][] = [];

    if (
      this.addressInfo?.isBillingAddress !== newAddressTypes.isBillingAddress ||
      this.addressInfo?.isDefaultBillingAddress !== newAddressTypes.isDefaultBillingAddress
    ) {
      if (this.addressInfo?.isBillingAddress) {
        actions.push('removeBillingAddressId');
      }
      newAddressTypes.isBillingAddress && actions.push('addBillingAddressId');
      newAddressTypes.isDefaultBillingAddress && actions.push('setDefaultBillingAddress');
    }

    if (
      this.addressInfo?.isShippingAddress !== newAddressTypes.isShippingAddress ||
      this.addressInfo?.isDefaultShippingAddress !== newAddressTypes.isDefaultShippingAddress
    ) {
      if (this.addressInfo?.isShippingAddress) {
        actions.push('removeShippingAddressId');
      }
      newAddressTypes.isShippingAddress && actions.push('addShippingAddressId');
      newAddressTypes.isDefaultShippingAddress && actions.push('setDefaultShippingAddress');
    }

    return actions;
  }

  private addActionsForAddTypes(newAddressTypes: AddressTypes): ActionsForUpdateAddressTypes['action'][] {
    const actions: ActionsForUpdateAddressTypes['action'][] = [];
    newAddressTypes.isBillingAddress && actions.push('addBillingAddressId');
    newAddressTypes.isShippingAddress && actions.push('addShippingAddressId');
    newAddressTypes.isDefaultBillingAddress && actions.push('setDefaultBillingAddress');
    newAddressTypes.isDefaultShippingAddress && actions.push('setDefaultShippingAddress');

    return actions;
  }

  private switchDisabledState(inputId: string): void {
    const input = safeQuerySelector<HTMLInputElement>(inputId);
    input.disabled = !input.disabled;
    if (input.disabled) {
      input.checked = false;
    }
  }
}
