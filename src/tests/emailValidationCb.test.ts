import { emailValidationCb } from '../utils/customValidationCb';
import { z } from 'zod';
import { FormFields } from '@customTypes/enums';
import { addIssueMock } from './testHelper';

const fieldName = FormFields.email;

describe('emailValidationCb tests', () => {
  let ctxMock: z.RefinementCtx;

  beforeEach(() => {
    ctxMock = {
      addIssue: jest.fn(),
      path: [],
    };
    addIssueMock.mockClear();
  });

  describe.each([
    ['', 'This field is mandatory'],
    ['te st@example.com', 'You can only use Latin letters, numerals, underscores, periods, and minus signs.'],
    ['a@test@example.com', `Email address must contain one '@' symbol separating local part and domain name.`],
    ['test@example', `Email address must contain a domain name after '@' (e.g., @example.com).`],
    ['test', `Email has invalid format`],
    ['  test@email.com  ', `${fieldName} must not contain leading or trailing whitespace`],
  ])(`should fail validation:`, (value, message) => {
    it(`email: '${value}'. ${message}`, () => {
      emailValidationCb(value, ctxMock);
      expect(ctxMock.addIssue).toHaveBeenCalledWith({
        code: z.ZodIssueCode.custom,
        message,
      });
    });
  });
  it(`'user@example.com' should pass validation`, () => {
    const email = 'user@example.com';
    emailValidationCb(email, ctxMock);
    expect(ctxMock.addIssue).not.toHaveBeenCalled();
  });
});
