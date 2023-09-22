import { firstNameValidationCb, lastNameValidationCb } from '../utils/customValidationCb';
import { z } from 'zod';

describe('passwordValidationCb', () => {
  let ctxMock: z.RefinementCtx;

  beforeEach(() => {
    ctxMock = {
      addIssue: jest.fn(),
      path: [],
    };
  });
  [
    { name: 'First', fn: firstNameValidationCb },
    { name: 'Last', fn: lastNameValidationCb },
  ].forEach(({ name, fn }) => {
    describe.each([
      ['', 'This field is mandatory'],
      ['  test', `${name} name must not starts with whitespaces`],
      ['1abc2', `${name} name must contain only letters`],
    ])(`should fail validation:`, (value, message) => {
      it(`${fn.name}('${value}') ${message}`, () => {
        fn(value, ctxMock);
        expect(ctxMock.addIssue).toHaveBeenCalledWith({
          code: z.ZodIssueCode.custom,
          message,
        });
      });
    });

    it(`${fn.name}('Test') should pass validation`, () => {
      fn('Test', ctxMock);
      expect(ctxMock.addIssue).not.toHaveBeenCalled();
    });
  });
});
