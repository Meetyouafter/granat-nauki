import { z } from 'zod';

export const sessionIdParamsSchema = z.object({
  id: z.string().min(1).max(64),
});
