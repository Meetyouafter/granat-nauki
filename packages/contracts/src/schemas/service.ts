import { z } from 'zod';

import { MAX_SERVICE_DESCRIPTION_LENGTH, MAX_SERVICE_TITLE_LENGTH } from '../limits';

const title = z.string().trim().nonempty().max(MAX_SERVICE_TITLE_LENGTH);
const description = z.string().trim().nonempty().max(MAX_SERVICE_DESCRIPTION_LENGTH);

export const serviceSchema = z.object({
  titleRu: title,
  titleEn: title,
  descriptionRu: description,
  descriptionEn: description,
  duration: z.int().positive(),
  price: z.int().positive(),
  isPublished: z.boolean(),
});

export type ServiceInput = z.infer<typeof serviceSchema>;

export const serviceIdParamsSchema = z.object({
  id: z.string().nonempty(),
});

export type ServiceIdParamsInput = z.input<typeof serviceIdParamsSchema>;
export type ServiceIdParams = z.output<typeof serviceIdParamsSchema>;
