import { z } from 'zod';
import { checkMaxLength, checkMinLength } from '../utils/validationHelper';
import { FormFields } from '../types/enums';
import { addIssueMock, createTestLengthData, ctxMock } from './testHelper';

const minLength = 5;
const fieldName = FormFields.firstName;
const maxLength = 10;
const minMessage = `${fieldName} must be at least ${minLength} characters long`;
const maxMessage = `${fieldName} must have no more than ${maxLength} characters long`;

describe.each(createTestLengthData(minLength, maxLength))(
  `checkMinLength & checkMaxLength tests min = ${minLength}, max = ${maxLength}`,
  (value) => {
    describe(`${value.length} character(s): ${value}`, () => {
      beforeEach(() => {
        addIssueMock.mockClear();
      });
      const len = value.length;
      if (len < minLength) {
        it(`checkMinLength should call the addIssue method if the length is less than ${minLength} characters `, () => {
          checkMinLength(value, ctxMock, minLength, fieldName);
          expect(ctxMock.addIssue).toHaveBeenCalledWith({
            code: z.ZodIssueCode.custom,
            message: minMessage,
          });
        });
      } else {
        it(`checkMinLength should not call the addIssue method if the length is greater than ${minLength} characters `, () => {
          checkMinLength(value, ctxMock, minLength, fieldName);
          expect(ctxMock.addIssue).not.toHaveBeenCalled();
        });
      }
      if (len > maxLength) {
        it(`checkMaxLength should call the addIssue method if the length is greater than ${maxLength} characters `, () => {
          checkMaxLength(value, ctxMock, maxLength, FormFields.firstName);
          expect(ctxMock.addIssue).toHaveBeenCalledWith({
            code: z.ZodIssueCode.custom,
            message: maxMessage,
          });
        });
      } else {
        it(`checkMaxLength should not call the addIssue method if the length is less than ${maxLength} characters `, () => {
          checkMaxLength(value, ctxMock, maxLength, FormFields.firstName);
          expect(ctxMock.addIssue).not.toHaveBeenCalled();
        });
      }
    });
  },
);

afterAll(() => {
  addIssueMock.mockClear();
});
