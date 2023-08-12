import { ValidationCb } from '@customTypes/types';
import { z } from 'zod';

class Validator {
  public email: z.ZodString;
  public password: z.ZodString;
  public firstName: z.ZodString;
  public lastName: z.ZodString;
  public birthDate: z.ZodString;
  public street: z.ZodString;
  public city: z.ZodString;
  public country: z.ZodString;
  public postalCode: z.ZodString;

  constructor() {
    this.email = z.string();
    this.password = z.string();
    this.firstName = z.string();
    this.lastName = z.string();
    this.birthDate = z.string();
    this.street = z.string();
    this.city = z.string();
    this.country = z.string();
    this.postalCode = z.string();
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
