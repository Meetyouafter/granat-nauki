import {
  accessRequestsQuerySchema,
  type AccessRequestsResponse,
  type MyAccessRequestResponse,
} from '@granat/contracts';

import { createAccessRequest, getAllAccessRequests } from '@/lib/accessRequest/accessRequest';
import { requireAdmin, requireUser } from '@/lib/auth/dal';
import { parseQuery, withErrorHandling } from '@/lib/http';

export const POST = withErrorHandling(async () => {
  const { user } = await requireUser();

  const accessRequest = await createAccessRequest(user.id);

  return Response.json({
    status: accessRequest.status,
    createdAt: accessRequest.createdAt.toISOString(),
  } satisfies MyAccessRequestResponse, { status: 201 });
});

export const GET = withErrorHandling(async (request) => {
  await requireAdmin();

  const params = parseQuery(request, accessRequestsQuerySchema);
  const { accessRequests, total, totalPages } = await getAllAccessRequests(params);

  const data = accessRequests.map(accessRequest => ({
    ...accessRequest,
    createdAt: accessRequest.createdAt.toISOString(),
    updatedAt: accessRequest.updatedAt.toISOString(),
  }));

  return Response.json({ data, params, total, totalPages } satisfies AccessRequestsResponse);
});
