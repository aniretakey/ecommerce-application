import { passwordValidationCb } from '../utils/customValidationCb';
import { z } from 'zod';
import { FormFields, MIN_PASSWORD_LENGTH } from '@customTypes/enums';

const fieldName = FormFields.password;

describe('passwordValidationCb', () => {
  let ctxMock: z.RefinementCtx;

  beforeEach(() => {
    ctxMock = {
      addIssue: jest.fn(),
      path: [],
    };
  });

  describe.each([
    ['', 'This field is mandatory'],
    ['test', `${fieldName} must be at least ${MIN_PASSWORD_LENGTH} characters long`],
    ['test', `Password must contain at least one uppercase letter`],
    ['TEST', 'Password must contain at least one lowercase letter'],
    ['test', 'Password must contain at least one digit'],
    ['test', 'Password must contain at least one special character (e.g., !@#$%^&*)'],
    ['  test  ', `${fieldName} must not contain leading or trailing whitespace`],
  ])(`should fail validation:`, (value, message) => {
    it(`password: '${value}'. ${message}`, () => {
      // const message = 'This field is mandatory';

      passwordValidationCb(value, ctxMock);

      expect(ctxMock.addIssue).toHaveBeenCalledWith({
        code: z.ZodIssueCode.custom,
        message,
      });
    });
  });

  it(`'Password123!' should pass validation`, () => {
    const password = 'Password123!';
    passwordValidationCb(password, ctxMock);
    expect(ctxMock.addIssue).not.toHaveBeenCalled();
  });
});
