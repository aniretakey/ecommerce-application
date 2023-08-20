import { postalCodeValidationCb } from '../utils/customValidationCb';
import { z } from 'zod';
import { FormFields, MAX_POSTAL_CODE_LENGTH, MIN_POSTAL_CODE_LENGTH } from '@customTypes/enums';
import { addIssueMock } from './testHelper';

const fieldName = FormFields.postalCode;

describe('postalCodeValidationCb', () => {
  let ctxMock: z.RefinementCtx;

  beforeEach(() => {
    addIssueMock.mockClear();
    ctxMock = {
      addIssue: jest.fn(),
      path: [],
    };
  });

  it(`should fail validation if field is empty`, () => {
    postalCodeValidationCb('', ctxMock);
    expect(ctxMock.addIssue).toHaveBeenCalledWith({
      code: z.ZodIssueCode.custom,
      message: 'This field is mandatory',
    });
  });

  it(`should fail validation if ${MAX_POSTAL_CODE_LENGTH} < value length < ${MIN_POSTAL_CODE_LENGTH} `, () => {
    postalCodeValidationCb('1'.repeat(MIN_POSTAL_CODE_LENGTH - 1), ctxMock);
    expect(ctxMock.addIssue).toHaveBeenCalledWith({
      code: z.ZodIssueCode.custom,
      message: `${fieldName} must be at least ${MIN_POSTAL_CODE_LENGTH} characters long`,
    });

    addIssueMock.mockClear();
    postalCodeValidationCb('1'.repeat(MAX_POSTAL_CODE_LENGTH + 1), ctxMock);
    expect(ctxMock.addIssue).toHaveBeenCalledWith({
      code: z.ZodIssueCode.custom,
      message: `${fieldName} must have no more than ${MAX_POSTAL_CODE_LENGTH} characters long`,
    });
  });

  it(`should pass validation if value is 6 digits`, () => {
    postalCodeValidationCb('123456', ctxMock);
    expect(ctxMock.addIssue).not.toHaveBeenCalled();
  });
});
