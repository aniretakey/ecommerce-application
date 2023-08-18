import { z } from 'zod';
import { checkMandatory } from '../utils/validationHelper'; // Подставьте путь к модулю с вашей функцией

const addIssueMock = jest.fn();

const ctxMock: z.RefinementCtx = {
  addIssue: addIssueMock,
  path: [],
};

describe('checkMandatory tests', () => {
  describe('field is empty', () => {
    beforeEach(() => {
      const value = '';
      checkMandatory(value, ctxMock);
    });
    const message = 'This field is mandatory';
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
      ['!', 'one special character'],
      ['a', 'one letter'],
      ['1', 'one digit'],
      ['abc123', 'multiple characters'],
    ])(`should not call addIssue method if there is at least one character in the field`, (val, mess) => {
      // const value = val
      checkMandatory(val, ctxMock);

      it(`${mess}: '${val}'`, () => {
        expect(ctxMock.addIssue).not.toHaveBeenCalled();
      });
    });
  });
});
