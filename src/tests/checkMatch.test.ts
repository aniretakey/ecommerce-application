import { z } from 'zod';
import { checkMatch } from '../utils/validationHelper';
import { addIssueMock, ctxMock } from './testHelper';

describe.each([
  [/[^A-ZА-Яa-zа-я0-9Ёё\s]/, 'test!test', 'at least one special character', 'test'],
  [/(^[а-яa-zА-ЯA-ZЁё]+$)/, 'test', 'only letters', 'test123test'],
  [/^[0-9]*$/, '132', 'only numbers', '132abc!'],
])(`test checkMatch`, (regexp, validVal, message, invalidVal) => {
  describe(`regexp: ${regexp}. Value should contain ${message}`, () => {
    it(`value: '${validVal}'. It should not call addIssue method if the value matches the regexp`, () => {
      checkMatch(validVal, ctxMock, regexp, message);
      expect(ctxMock.addIssue).not.toHaveBeenCalled();
    });

    it(`value: '${invalidVal}'. It should call addIssue method if the value doesn't matches the regexp`, () => {
      checkMatch(invalidVal, ctxMock, regexp, message);
      expect(ctxMock.addIssue).toHaveBeenCalledWith({
        code: z.ZodIssueCode.custom,
        message,
      });
    });
  });

  afterAll(() => {
    addIssueMock.mockClear();
  });
});
