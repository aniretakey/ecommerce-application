import { Customer } from '@commercetools/platform-sdk';
import { EditPersonalInfoFrom } from '@components/form/EditPersonalInfoForm';
import { updateCustomerPersonalInfo } from '@utils/apiRequests';

const oldUserInfo = {
  email: 'user@test.com',
  firstName: 'Test',
  lastName: 'Test',
  dateOfBirth: '2000-01-01',
};
const newUserInfo = {
  email: 'newuser@example.com',
  firstName: 'Ivan',
  lastName: 'Ivanov',
  dateOfBirth: '1970-02-02',
};
const userInfo: Customer = {
  ...oldUserInfo,
  id: '1',
  version: 1,
  createdAt: 'createdAt',
  lastModifiedAt: 'lastModifiedAt',
  addresses: [],
  isEmailVerified: false,
  authenticationMode: '',
};
jest.mock('../utils/apiRequests', () => ({
  updateCustomerPersonalInfo: jest.fn().mockResolvedValue({}),
}));

describe('EditPersonalInfoFrom', () => {
  document.body.innerHTML = `
   <input  id="userProfileEmail" type="text" value="${newUserInfo.email}">
   <input id="userProfileFirst-name" type="text" value="${newUserInfo.firstName}">
   <input id="userProfileLast-name" type="text" value="${newUserInfo.lastName}">
    <input id="userProfileBirth-date" type="date" value="${newUserInfo.dateOfBirth}">
  `;

  it(`should update userInfo`, async () => {
    const editPersonalInfoFrom = new EditPersonalInfoFrom(1, userInfo);
    const checkAllFieldsCorrectness = 'checkAllFieldsCorrectness';
    editPersonalInfoFrom[checkAllFieldsCorrectness] = jest.fn().mockReturnValue(false);

    await editPersonalInfoFrom.editInfo(new Event('test'));

    expect(updateCustomerPersonalInfo).toHaveBeenCalledWith(1, newUserInfo);
  });
});

afterAll(() => {
  jest.resetAllMocks();
});
