import { passwordValidationCb } from '../utils/customValidationCb';
import { validator } from '../utils/validator';
import { z } from 'zod';
import { ctxMock } from './testHelper';

describe('validate function', () => {
  it('should return undefined for a valid value', () => {
    const field: z.ZodString = z.string();
    const value = 'Password123!';
    const safeParseMock = jest.spyOn(field, 'safeParse').mockReturnValue({ success: true, data: 'Password123!' });

    const result = validator.validate(field, value, passwordValidationCb.bind(null, value, ctxMock));

    expect(result).toBeUndefined();
    expect(ctxMock.addIssue).not.toHaveBeenCalled();
    safeParseMock.mockRestore();
  });
});
