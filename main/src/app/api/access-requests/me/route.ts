import type { MyAccessRequestResponse } from '@granat/contracts';

import { getLatestAccessRequest } from '@/lib/accessRequest/accessRequest';
import { requireUser } from '@/lib/auth/dal';
import { withErrorHandling } from '@/lib/http';

export const GET = withErrorHandling(async () => {
  const { user } = await requireUser();
  const accessRequest = await getLatestAccessRequest(user.id);

  return Response.json({
    status: accessRequest?.status ?? null,
    createdAt: accessRequest?.createdAt.toISOString() ?? null,
  } satisfies MyAccessRequestResponse);
});
