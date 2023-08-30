import { signUp } from '@utils/apiRequests';
import { RegistrationForm } from '../components/form/RegistrationForm';
import { createFakeRegForm } from './testHelper';

jest.mock('../utils/apiRequests', () => ({
  updateCustomerPersonalInfo: jest.fn().mockResolvedValue({}),
  signUp: jest.fn().mockResolvedValue({}),
  signIn: jest.fn().mockRejectedValue(new Error('test error')),
}));

jest.mock('../utils/ApiClient', () => ({
  apiClient: {
    getNewPassFlowToken: jest.fn().mockResolvedValue({}),
  },
}));
// eslint-disable-next-line max-lines-per-function
describe('RegistrationForm', () => {
  const userInfo = {
    email: 'user@test.com',
    password: 'password',
    firstName: 'Test',
    lastName: 'Test',
    dateOfBirth: '2000-01-01',
  };
  const billingAddress = { country: 'Russia', city: 'Moscow', streetName: 'Red Square', postalCode: '123456' };
  const shippingAddress = {
    country: 'Russia',
    city: 'Saint Petersburg',
    streetName: 'Nevsky prospect',
    postalCode: '789101',
  };
  /* const oneAddr = false
const isDefaultShippingAddress = false
const isDefaultBillingAddress = false
 document.body.innerHTML = `
<form class="registration__form" id="registrationForm">
  <div class="registration__first-name-container form-field-container" data-valid="false" value="${userInfo.firstName}">
 <input class="registration__first-name-input" type="text" id="registrationFirst-name">
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
<input class="registration__save-one-address-input" type="checkbox" id="registrationsave-one-address" ${oneAddr? 'checked':''}>
</div>
<div class="registration__country-shipping-container form-field-container" data-valid="true">
<input class="registration__country-input" type="text" id="registrationCountry-shipping" value="${shippingAddress.country}">
</div>
<div class="registration__city-shipping-container form-field-container" data-valid="false">
<input class="registration__city-input" type="text" id="registrationCity-shipping" value="${shippingAddress.city}">
</div>
<div class="registration__street-shipping-container form-field-container" data-valid="false">
<input class="registration__street-input" type="text" id="registrationStreet-shipping" value="${shippingAddress.streetName}">
</div>
<div class="registration__postal-code-shipping-container form-field-container" data-valid="false">
<input class="registration__postal-code-input" type="text" id="registrationPostal-code-shipping" value="${shippingAddress.postalCode}">
</div>
<div class="registration__set-default-shipping-container form-field-container" data-valid="true">
<input class="registration__set-default-shipping-input" type="checkbox" id="registrationset-default-shipping" ${isDefaultShippingAddress? 'checked':''}>
</div>
<div class="registration__country-billing-container form-field-container" data-valid="true">
<input class="registration__country-input" type="text" id="registrationCountry-billing" value="${billingAddress.country}">
</div>
<div class="registration__city-billing-container form-field-container" data-valid="false">
<input class="registration__city-input" type="text" id="registrationCity-billing" value="${billingAddress.city}">
</div>
<div class="registration__street-billing-container form-field-container" data-valid="false">
<input class="registration__street-input" type="text" id="registrationStreet-billing" value="${billingAddress.streetName}">
</div>
<div class="registration__postal-code-billing-container form-field-container" data-valid="false">
<input class="registration__postal-code-input" type="text" id="registrationPostal-code-billing" value="${billingAddress.postalCode}">
</div>
<div class="registration__set-default-billing-container form-field-container" data-valid="true">
<input class="registration__set-default-billing-input" type="checkbox" id="registrationset-default-billing"  ${isDefaultBillingAddress? 'checked':''}>
</div>

<div class="registration__show-pw-container form-field-container" data-valid="true">
<input class="registration__show-pw-input" type="checkbox" id="registrationshow-pw">
</div>
<button class="registration__submit-btn" id="registrationSubmitBtn">Sign Up</button>
</form>
  ` */
  const registrationForm = new RegistrationForm();
  const checkAllFieldsCorrectness = 'checkAllFieldsCorrectness';
  registrationForm[checkAllFieldsCorrectness] = jest.fn().mockReturnValue(false);
  //document.body.append(registrationForm.form.getNode())
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it(`should set different addresses with default shipping & billing`, () => {
    const isOneAddr = false;
    const isDefaultShippingAddress = true;
    const isDefaultBillingAddress = true;

    document.body.innerHTML = '';
    document.body.innerHTML = createFakeRegForm(
      isOneAddr,
      isDefaultBillingAddress,
      isDefaultShippingAddress,
      userInfo,
      shippingAddress,
      billingAddress,
    );

    registrationForm.submitBtn.getNode().dispatchEvent(new MouseEvent('click'));
    expect(signUp).toBeCalledWith({
      ...userInfo,
      addresses: [
        { ...shippingAddress, country: 'RU' },
        { ...billingAddress, country: 'RU' },
      ],
      billingAddresses: [1],
      shippingAddresses: [0],
      defaultShippingAddress: 0,
      defaultBillingAddress: 1,
    });
  });
  it(`should set the same address for billing and shipping`, () => {
    const isOneAddr = true;
    const isDefaultShippingAddress = true;
    const isDefaultBillingAddress = true;

    document.body.innerHTML = '';
    document.body.innerHTML = createFakeRegForm(
      isOneAddr,
      isDefaultBillingAddress,
      isDefaultShippingAddress,
      userInfo,
      shippingAddress,
      billingAddress,
    );

    registrationForm.submitBtn.getNode().dispatchEvent(new MouseEvent('click'));
    expect(signUp).toBeCalledWith({
      ...userInfo,
      addresses: [{ ...shippingAddress, country: 'RU' }],
      billingAddresses: [0],
      shippingAddresses: [0],
      defaultShippingAddress: 0,
      defaultBillingAddress: 0,
    });
  });
});

afterAll(() => {
  jest.resetAllMocks();
});
