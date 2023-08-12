import { z } from 'zod';
import { FormFields } from '@customTypes/enums';
import { ValidationCb } from '@customTypes/types';
import { checkMandatory, checkMatch, checkMinLength, checkMaxLength, checkWhitespaces } from './validationHelper';

const MIN_PASSWORD_LENGTH = 8;
const MIN_LENGTH = 1;
const POSTAL_CODE_LENGTH = 6;

export const passwordValidationCb: ValidationCb = (val: string, ctx: z.RefinementCtx) => {
  checkMandatory(val, ctx);
  checkMinLength(val, ctx, MIN_PASSWORD_LENGTH, FormFields.password);
  checkMatch(val, ctx, /[A-ZА-ЯЁ]/, 'Password must contain at least one uppercase letter');
  checkMatch(val, ctx, /[a-zа-яё]/, 'Password must contain at least one lowercase letter');
  checkMatch(val, ctx, /[0-9]/, 'Password must contain at least one digit');
  checkMatch(
    val,
    ctx,
    /[^A-ZА-Яa-zа-я0-9Ёё\s]/,
    'Password must contain at least one special character (e.g., !@#$%^&*)',
  );
  checkWhitespaces(val, ctx, FormFields.password);
};

export const emailValidationCb: ValidationCb = (val: string, ctx: z.RefinementCtx) => {
  checkMandatory(val, ctx);
  checkWhitespaces(val, ctx, FormFields.email);

  if (val.match(/[^_\-@.a-z0-9]/gi)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'You can only use Latin letters, numerals, underscores, periods, and minus signs.',
    });
  }

  if ([...val.matchAll(/@/g)].length !== 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Email address must contain one '@' symbol separating local part and domain name.`,
    });
  }
  checkMatch(
    val,
    ctx,
    /@[a-z]+\.[a-z]+[^.]$/i,
    `Email address must contain a domain name after '@' (e.g., @example.com).`,
  );
  checkMatch(val, ctx, /[\w_-]+@[a-z]+\.[a-z]+[^.]$/i, `Email has invalid format`);

  const res = z.string().email('Email has invalid format').safeParse(val);
  if (!res.success) {
    const error = res.error.issues[0];
    const errMessage = error ? error.message : '';
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: errMessage,
    });
  }
};

export const firstNameValidationCb: ValidationCb = (val: string, ctx: z.RefinementCtx) => {
  checkMandatory(val, ctx);
  checkMinLength(val, ctx, MIN_LENGTH, FormFields.firstName);
  checkMatch(val, ctx, /(^[а-яa-zА-ЯA-ZЁё]+$)/, 'First name must contain only letters');
};

export const lastNameValidationCb: ValidationCb = (val: string, ctx: z.RefinementCtx) => {
  checkMandatory(val, ctx);
  checkMinLength(val, ctx, MIN_LENGTH, FormFields.lastName);
  checkMatch(val, ctx, /(^[а-яa-zА-ЯA-ZЁё]+$)/, 'Last name must contain only letters');
};

export const countryValidationCb: ValidationCb = (val: string, ctx: z.RefinementCtx) => {
  checkMandatory(val, ctx);
  checkMinLength(val, ctx, MIN_LENGTH, FormFields.country);
  checkMatch(val, ctx, /^(Russia|Россия)$/i, 'Sorry, we only deliver to Russia');
};

export const cityValidationCb: ValidationCb = (val: string, ctx: z.RefinementCtx) => {
  checkMandatory(val, ctx);
  checkMinLength(val, ctx, MIN_LENGTH, FormFields.city);
  checkMatch(val, ctx, /(^[а-яa-zА-ЯA-ZЁё]+$)/, 'City name must contain only letters');
};

export const streetValidationCb: ValidationCb = (val: string, ctx: z.RefinementCtx) => {
  checkMandatory(val, ctx);
  checkMinLength(val, ctx, MIN_LENGTH, FormFields.street);
  checkMatch(val, ctx, /^[а-яa-zА-ЯA-Z0-9 ]*$/, 'Street name must contain only letters, numbers and spaces');
};

export const postalCodeValidationCb: ValidationCb = (val: string, ctx: z.RefinementCtx) => {
  checkMatch(val, ctx, /^[0-9]*$/, 'Postal code must contain only numbers');
  checkMandatory(val, ctx);
  checkMinLength(val, ctx, 6, FormFields.postalCode);
  checkMaxLength(val, ctx, POSTAL_CODE_LENGTH, FormFields.postalCode);
};

export const ageValidationCb: ValidationCb = (val: string, ctx: z.RefinementCtx) => {
  const YEAR_IN_MSEC = 31536000000;
  const nowDate = new Date().getTime();
  const birthDate = new Date(val).getTime();
  const diffInMSEC = nowDate - birthDate;
  const diffInYears = Math.floor(diffInMSEC / YEAR_IN_MSEC);

  if (diffInYears < 14) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `You must be at least 14 years old`,
    });
  }
};
