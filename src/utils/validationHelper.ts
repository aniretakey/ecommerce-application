import { FormFields } from '@customTypes/enums';
import { z } from 'zod';

export function checkMandatory(val: string, ctx: z.RefinementCtx): void {
  if (val.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `This field is mandatory`,
    });
  }
}

export function checkMinLength(val: string, ctx: z.RefinementCtx, minLength: number, fieldName: FormFields): void {
  if (val.length < minLength) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${fieldName} must be at least ${minLength} characters long`,
    });
  }
}

export function checkMatch(val: string, ctx: z.RefinementCtx, regexp: RegExp, message: string): void {
  if (!val.match(regexp)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message,
    });
  }
}

export function checkWhitespaces(val: string, ctx: z.RefinementCtx, fieldName: FormFields): void {
  if (val.startsWith(' ') || val.endsWith(' ')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${fieldName} must not contain leading or trailing whitespace`,
    });
  }
}
