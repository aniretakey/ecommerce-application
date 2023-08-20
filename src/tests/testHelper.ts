import { z } from 'zod';
export const addIssueMock = jest.fn();

export const ctxMock: z.RefinementCtx = {
  addIssue: addIssueMock,
  path: [],
};

export function createTestLengthData(minLength: number, maxLength: number): string[] {
  const str = 'a';
  return [
    ...new Set([
      '',
      str.repeat(minLength - 1),
      str.repeat(minLength),
      str.repeat(minLength + 1),
      str.repeat(maxLength - 1),
      str.repeat(maxLength),
      str.repeat(maxLength + 1),
    ]),
  ];
}
