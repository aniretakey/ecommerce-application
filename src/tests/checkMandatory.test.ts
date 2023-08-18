import { z } from 'zod';
import { checkMandatory } from '../utils/validationHelper';
import { addIssueMock, ctxMock } from './testHelper';

const message = 'This field is mandatory';

describe('checkMandatory tests', () => {
  describe('field is empty', () => {
    beforeEach(() => {
      const value = '';
      checkMandatory(value, ctxMock);
    });
    it('should call addIssue method if the field is empty', () => {
      expect(ctxMock.addIssue).toBeCalled();
    });
    it(`should add new issue with message '${message}' if the field is empty`, () => {
      expect(ctxMock.addIssue).toHaveBeenCalledWith({
        code: z.ZodIssueCode.custom,
        message,
      });
    });
    afterAll(() => {
      addIssueMock.mockClear(); //clears information about past calls after each test
    });
  });

  describe('field is not empty', () => {
    describe.each([
      [' ', 'one space'],
      ['a', 'one character'],
      ['abc123', 'multiple characters'],
    ])(`should not call addIssue method if there is at least one character in the field`, (val, mess) => {
      checkMandatory(val, ctxMock);

      it(`${mess}: '${val}'`, () => {
        expect(ctxMock.addIssue).not.toHaveBeenCalled();
      });
    });
  });
  afterAll(() => {
    addIssueMock.mockClear(); //clears information about past calls after each test
  });
});
