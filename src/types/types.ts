import { z } from 'zod';
export type ValidationCb = (val: string, ctx: z.RefinementCtx) => void;
