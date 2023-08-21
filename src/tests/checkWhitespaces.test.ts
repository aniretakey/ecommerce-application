import { z } from 'zod';
import { checkWhitespaces } from '../utils/validationHelper';
import { addIssueMock, ctxMock } from './testHelper';
import { FormFields } from '../types/enums';

const fieldName = FormFields.firstName;

describe(`test checkWhitespaces`, () => {
  beforeEach(() => {
    addIssueMock.mockClear();
  });
  const value = 'test';
  it(`value: '${value}'.It should not call addIssue method if the value doesn't contain leading or trailing whitespace`, () => {
    checkWhitespaces(value, ctxMock, fieldName);
    expect(ctxMock.addIssue).not.toHaveBeenCalled();
  });

  describe.each([
    [' test', 'leading whitespace'],
    ['test ', 'trailing whitespace'],
    ['  test  ', 'leading or trailing whitespace'],
  ])(`test invalid values`, (value, message) => {
    it(`value: '${value}'. It should call addIssue method if the value contains ${message}`, () => {
      checkWhitespaces(value, ctxMock, FormFields.firstName);
      expect(ctxMock.addIssue).toHaveBeenCalledWith({
        code: z.ZodIssueCode.custom,
        message: `${fieldName} must not contain leading or trailing whitespace`,
      });
    });
  });

  afterAll(() => {
    addIssueMock.mockClear();
  });
});
