import { API_STATUSES, type MyAccessRequestResponse } from '@granat/contracts';

import { createAccessRequest } from '@/lib/accessRequest/accessRequest';
import { requireUser } from '@/lib/auth/dal';
import { AppError } from '@/lib/errors';
import { withErrorHandling } from '@/lib/http';

export const POST = withErrorHandling(async () => {
  const { user } = await requireUser();
  if (user.role === 'ADMIN') throw new AppError(API_STATUSES.FORBIDDEN);

  const accessRequest = await createAccessRequest(user.id);

  return Response.json({
    status: accessRequest.status,
    createdAt: accessRequest.createdAt.toISOString(),
  } satisfies MyAccessRequestResponse, { status: 201 });
});
