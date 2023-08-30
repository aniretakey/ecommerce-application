import { BaseAddress, MyCustomerDraft } from '@commercetools/platform-sdk';
import { z } from 'zod';
export const addIssueMock = jest.fn();

export const ctxMock: z.RefinementCtx = {
  addIssue: addIssueMock,
  path: [],
};

export function createTestLengthData(minLength: number, maxLength: number): string[] {
  const str = 'a';
  return [
    ...new Set([
      '',
      str.repeat(minLength - 1),
      str.repeat(minLength),
      str.repeat(minLength + 1),
      str.repeat(maxLength - 1),
      str.repeat(maxLength),
      str.repeat(maxLength + 1),
    ]),
  ];
}
// eslint-disable-next-line max-lines-per-function
export function createFakeRegForm(
  isOneAddr: boolean,
  isDefaultBillingAddress: boolean,
  isDefaultShippingAddress: boolean,
  userInfo: MyCustomerDraft,
  shippingAddress: BaseAddress,
  billingAddress: BaseAddress,
): string {
  return `
<form class="registration__form" id="registrationForm">
  <div class="registration__first-name-container form-field-container" data-valid="false">
 <input class="registration__first-name-input" type="text" id="registrationFirst-name" value="${userInfo.firstName}">
</div>
<div class="registration__last-name-container form-field-container" data-valid="false">
<input class="registration__last-name-input" type="text" id="registrationLast-name"  value="${userInfo.lastName}">
</div>
<div class="registration__birth-date-container form-field-container" data-valid="false">
<input class="registration__birth-date-input" type="date" id="registrationBirth-date" value="${userInfo.dateOfBirth}">
</div>
<div class="registration__email-container form-field-container" data-valid="true">
<input class="registration__email-input" type="text" id="registrationEmail" value="${userInfo.email}">
</div>
<div class="registration__password-container form-field-container" data-valid="true">
<input class="registration__password-input" type="password" id="registrationPassword" value="${userInfo.password}">
</div>

<div class="registration__save-one-address-container form-field-container" data-valid="true">
<input class="registration__save-one-address-input" type="checkbox" id="registrationsave-one-address" ${
    isOneAddr ? 'checked' : ''
  }>
</div>
<div class="registration__country-shipping-container form-field-container" data-valid="true">
<input class="registration__country-input" type="text" id="registrationCountry-shipping" value="${
    shippingAddress.country
  }">
</div>
<div class="registration__city-shipping-container form-field-container" data-valid="false">
<input class="registration__city-input" type="text" id="registrationCity-shipping" value="${shippingAddress.city}">
</div>
<div class="registration__street-shipping-container form-field-container" data-valid="false">
<input class="registration__street-input" type="text" id="registrationStreet-shipping" value="${
    shippingAddress.streetName
  }">
</div>
<div class="registration__postal-code-shipping-container form-field-container" data-valid="false">
<input class="registration__postal-code-input" type="text" id="registrationPostal-code-shipping" value="${
    shippingAddress.postalCode
  }">
</div>
<div class="registration__set-default-shipping-container form-field-container" data-valid="true">
<input class="registration__set-default-shipping-input" type="checkbox" id="registrationset-default-shipping" ${
    isDefaultShippingAddress ? 'checked' : ''
  }>
</div>
<div class="registration__country-billing-container form-field-container" data-valid="true">
<input class="registration__country-input" type="text" id="registrationCountry-billing" value="${
    billingAddress.country
  }">
</div>
<div class="registration__city-billing-container form-field-container" data-valid="false">
<input class="registration__city-input" type="text" id="registrationCity-billing" value="${billingAddress.city}">
</div>
<div class="registration__street-billing-container form-field-container" data-valid="false">
<input class="registration__street-input" type="text" id="registrationStreet-billing" value="${
    billingAddress.streetName
  }">
</div>
<div class="registration__postal-code-billing-container form-field-container" data-valid="false">
<input class="registration__postal-code-input" type="text" id="registrationPostal-code-billing" value="${
    billingAddress.postalCode
  }">
</div>
<div class="registration__set-default-billing-container form-field-container" data-valid="true">
<input class="registration__set-default-billing-input" type="checkbox" id="registrationset-default-billing"  ${
    isDefaultBillingAddress ? 'checked' : ''
  }>
</div>

<div class="registration__show-pw-container form-field-container" data-valid="true">
<input class="registration__show-pw-input" type="checkbox" id="registrationshow-pw">
</div>
<button class="registration__submit-btn" id="registrationSubmitBtn">Sign Up</button>
</form>
  `;
}
