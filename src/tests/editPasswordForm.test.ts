import { EditPasswordForm } from '@components/form/EditPasswordForm';

jest.mock('../utils/ApiClient', () => ({
  apiClient: {
    getNewPassFlowToken: jest.fn().mockResolvedValue({ a: 1 }),
    updateCustomerPassword: jest.fn().mockResolvedValue({ a: 1 }),
  },
}));

describe('EditPasswordForm', () => {
  const editPasswordForm = new EditPasswordForm(1);
  document.body.innerHTML = `
  <input type="text" id="userProfilePassword-current" value="currentPassword" />
  <input type="text" id="userProfilePassword-new" value="newPassword" />
  <input type="text" id="userProfilePassword-confirm-new" value="confirmNewPassword" />
  `;

  it(`should throw error when passwords don't match`, async () => {
    const checkAllFieldsCorrectness = 'checkAllFieldsCorrectness';
    editPasswordForm[checkAllFieldsCorrectness] = jest.fn().mockReturnValue(false);
    await expect(editPasswordForm.editInfo(new Event('test'))).rejects.toThrow(
      'New password and confirm new password do not match!',
    );
  });
});

afterAll(() => {
  jest.resetAllMocks();
});
