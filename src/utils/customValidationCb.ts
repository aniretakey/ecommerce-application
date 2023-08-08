import { z } from 'zod';
import { FormFields } from '../types/enums';
import { ValidationCb } from '../types/types';

const MIN_PASSWORD_LENGTH = 8;

export const passwordValidationCb: ValidationCb = (val: string, ctx: z.RefinementCtx) => {
  if (val.length < MIN_PASSWORD_LENGTH) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${FormFields.password} must be at least ${MIN_PASSWORD_LENGTH} characters long`,
    });
  }
  checkMatch(val, ctx, /[A-Z]/, FormFields.password, 'uppercase letter');
  checkMatch(val, ctx, /[a-z]/, FormFields.password, 'lowercase letter');
  checkMatch(val, ctx, /[0-9]/, FormFields.password, 'digit');
  checkMatch(val, ctx, /[^\w\s]/, FormFields.password, 'special character (e.g., !@#$%^&*)');

  if (val.startsWith(' ') || val.endsWith(' ')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${FormFields.password} must not contain leading or trailing whitespace`,
    });
  }
};

function checkMatch(
  val: string,
  ctx: z.RefinementCtx,
  regexp: RegExp,
  fieldName: FormFields,
  requiredChar: string,
): void {
  if (!val.match(regexp)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${fieldName} must contain at least one ${requiredChar}`,
    });
  }
}
