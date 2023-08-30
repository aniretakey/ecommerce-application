import { EditAddressForm } from '@components/form/EditAddressForm';
import { addCustomerAddress, updateCustomerAddress } from '@utils/apiRequests';

const newAddressInfo = { country: 'RU', city: 'Moscow', streetName: 'street', postalCode: '123456' };

const newAddressTypes = {
  isBillingAddress: false,
  isShippingAddress: false,
  isDefaultBillingAddress: false,
  isDefaultShippingAddress: false,
};
const addressInfo = {
  id: 'id',
  ...newAddressInfo,
  ...newAddressTypes,
};
jest.mock('../utils/apiRequests', () => ({
  updateCustomerAddress: jest.fn().mockResolvedValue({ body: { version: 1 } }),
  addCustomerAddress: jest.fn().mockResolvedValue({ body: { version: 1, addresses: [{ id: '1' }, { id: '2' }] } }),
  setAddressTypes: jest.fn(),
}));
// eslint-disable-next-line max-lines-per-function
describe('editAddressForm', () => {
  document.body.innerHTML = `
  <div class="userprofile__country-container form-field-container">
    <input class="userprofile__country-input" type="text" id="userProfileCountry" value="Russia">
  </div>
  <div class="userprofile__city-container form-field-container">
    <input class="userprofile__city-input id="userProfileCity" value="${newAddressInfo.city}">
  </div>
  <div class="userprofile__street-container form-field-container">
    <input class="userprofile__street-input type="text" id="userProfileStreet" value="${newAddressInfo.streetName}">
  </div>
  <div class="userprofile__postal-code-container form-field-container">
    <input class="userprofile__postal-code-input" type="text" id="userProfilePostal-code" value="${newAddressInfo.postalCode}">
  </div>
  <div class="userprofile__set-shipping-container form-field-container">
    <input class="userprofile__set-shipping-input" type="checkbox" id="userProfileset-shipping">
  </div>
  <div class="userprofile__set-billing-container form-field-container">
    <input class="userprofile__set-billing-input" type="checkbox" id="userProfileset-billing">
  </div>
  <div class="userprofile__set-default-shipping-container form-field-container">
    <input class="userprofile__set-default-shipping-input" type="checkbox" id="userProfileset-default-shipping" disabled="">
  </div>
  <div class="userprofile__set-default-billing-container form-field-container">
    <input class="userprofile__set-default-billing-input" type="checkbox" id="userProfileset-default-billing" disabled="">
  </div>
  `;

  it(`should update address if  addressInfo is present`, async () => {
    const editAddressForm = new EditAddressForm(1, addressInfo);
    const checkAllFieldsCorrectness = 'checkAllFieldsCorrectness';
    editAddressForm[checkAllFieldsCorrectness] = jest.fn().mockReturnValue(false);
    await editAddressForm.editInfo(new Event('test'));

    expect(updateCustomerAddress).toHaveBeenCalledWith(1, addressInfo.id, newAddressInfo);
  });

  it(`should add new address if  addressInfo isn't present`, async () => {
    const editAddressForm = new EditAddressForm(1);
    const checkAllFieldsCorrectness = 'checkAllFieldsCorrectness';
    editAddressForm[checkAllFieldsCorrectness] = jest.fn().mockReturnValue(false);
    await editAddressForm.editInfo(new Event('test'));

    expect(addCustomerAddress).toHaveBeenCalledWith(1, newAddressInfo);
  });

  // eslint-disable-next-line max-lines-per-function
  describe('addActionsForUpdateTypes', () => {
    it('should return empty actions if address types have not changed', () => {
      const addressInfo = {
        ...newAddressInfo,
        isBillingAddress: true,
        isDefaultBillingAddress: true,
        isShippingAddress: true,
        isDefaultShippingAddress: true,
      };

      const newAddressTypes = {
        isBillingAddress: true,
        isDefaultBillingAddress: true,
        isShippingAddress: true,
        isDefaultShippingAddress: true,
      };

      const editAddressForm = new EditAddressForm(1, addressInfo);
      const addActionsForUpdateTypes = 'addActionsForUpdateTypes';
      const actions = editAddressForm[addActionsForUpdateTypes](newAddressTypes);

      expect(actions).toEqual([]);
    });

    it('should return correct actions if address types have changed', () => {
      const addressInfo = {
        ...newAddressInfo,
        isBillingAddress: true,
        isDefaultBillingAddress: true,
        isShippingAddress: true,
        isDefaultShippingAddress: true,
      };

      const newAddressTypes = {
        isBillingAddress: false,
        isDefaultBillingAddress: false,
        isShippingAddress: false,
        isDefaultShippingAddress: false,
      };

      const editAddressForm = new EditAddressForm(1, addressInfo);
      const addActionsForUpdateTypes = 'addActionsForUpdateTypes';
      const actions = editAddressForm[addActionsForUpdateTypes](newAddressTypes);

      expect(actions).toEqual(['removeBillingAddressId', 'removeShippingAddressId']);
    });
  });
});

afterAll(() => {
  jest.resetAllMocks();
});
