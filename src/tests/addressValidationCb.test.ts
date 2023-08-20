import { cityValidationCb, streetValidationCb } from '../utils/customValidationCb';
import { z } from 'zod';
import { FormFields, MIN_LENGTH } from '@customTypes/enums';
import { addIssueMock } from './testHelper';

describe('cityValidationCb & streetValidationCb tests', () => {
  let ctxMock: z.RefinementCtx;

  beforeEach(() => {
    ctxMock = {
      addIssue: jest.fn(),
      path: [],
    };
    addIssueMock.mockClear();
  });

  describe(`should fail validation`, () => {
    const value = '';
    [
      { fn: cityValidationCb, fieldName: FormFields.city },
      { fn: streetValidationCb, fieldName: FormFields.street },
    ].forEach(({ fn, fieldName }) => {
      it(`${fn.name} should fail validation if value is empty or  the length is less than ${MIN_LENGTH} characters`, () => {
        fn(value, ctxMock);
        expect(ctxMock.addIssue).toHaveBeenCalledWith({
          code: z.ZodIssueCode.custom,
          message: `${fieldName} must be at least ${MIN_LENGTH} characters long`,
        });
        expect(ctxMock.addIssue).toHaveBeenCalledWith({
          code: z.ZodIssueCode.custom,
          message: 'This field is mandatory',
        });
      });
    });
  });
});
