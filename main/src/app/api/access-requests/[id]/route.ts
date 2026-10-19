import {
  type AccessRequestDecisionResponse,
  accessRequestDecisionSchema,
  accessRequestIdParamsSchema,
} from '@granat/contracts';

import { decideAccessRequest } from '@/lib/accessRequest/accessRequest';
import { requireAdmin } from '@/lib/auth/dal';
import { parseBody, parseParams, withErrorHandling } from '@/lib/http';

export const PATCH = withErrorHandling(
  async (request, { params }: RouteContext<'/api/access-requests/[id]'>) => {
    await requireAdmin();
    const { id } = await parseParams(params, accessRequestIdParamsSchema);
    const { status } = await parseBody(request, accessRequestDecisionSchema);

    const accessRequest = await decideAccessRequest(id, status);

    return Response.json({
      accessRequest: {
        ...accessRequest,
        createdAt: accessRequest.createdAt.toISOString(),
        updatedAt: accessRequest.updatedAt.toISOString(),
      },
    } satisfies AccessRequestDecisionResponse);
  },
);
