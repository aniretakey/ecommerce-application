import { ValidationCb } from '@customTypes/types';
import { z } from 'zod';

class Validator {
  public inputString: z.ZodString;

  constructor() {
    this.inputString = z.string();
  }

  public validate<T extends z.ZodString>(field: T, value: string, validateCb?: ValidationCb): string | undefined {
    const result = (validateCb ? field.superRefine(validateCb) : field).safeParse(value);

    if (!result.success) {
      const error = result.error.issues[0];
      const errMessage = error ? error.message : '';
      return errMessage;
    } else {
      //   console.log('data: ', result.data);
    }
  }
}

/**
 * @example
 * ```ts
 * validator.validate(validator.password, '123Aa!*ddsd', passwordValidationCb)
 * validator.validate(validator.email, 'user@example.com', emailValidationCb);
 * ```
 */
export const validator = new Validator();
