import { countryValidationCb } from '../utils/customValidationCb';
import { z } from 'zod';
import { FormFields, MIN_LENGTH } from '@customTypes/enums';
import { addIssueMock } from './testHelper';

const fieldName = FormFields.country;

describe('countryValidationCb tests', () => {
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
    ['', `${fieldName} must be at least ${MIN_LENGTH} characters long`],
    ['Not Russia!', 'Country name must contain only letters'],
  ])(`should fail validation:`, (value, message) => {
    it(`country: '${value}'. ${message}`, () => {
      countryValidationCb(value, ctxMock);
      expect(ctxMock.addIssue).toHaveBeenCalledWith({
        code: z.ZodIssueCode.custom,
        message,
      });
    });
  });

  ['Russia', 'Россия'].forEach((country) => {
    it(`should pass validation if the value is '${country}'`, () => {
      countryValidationCb(country, ctxMock);
      expect(ctxMock.addIssue).not.toHaveBeenCalled();
    });
  });
});
