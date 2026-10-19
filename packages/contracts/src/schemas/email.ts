import { z } from 'zod';

import { MAX_EMAIL_LENGTH } from '../limits';

export const email = z.string().trim().toLowerCase().max(MAX_EMAIL_LENGTH).pipe(z.email());
