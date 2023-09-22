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

  const registrationForm = new RegistrationForm();
  const checkAllFieldsCorrectness = 'checkAllFieldsCorrectness';
  registrationForm[checkAllFieldsCorrectness] = jest.fn().mockReturnValue(false);
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
