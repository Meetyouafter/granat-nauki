import {
  serviceIdParamsSchema,
  type ServiceIdResponse,
  servicePublishSchema,
  type ServiceResponse,
  serviceSchema,
} from '@granat/contracts';

import { requireAdmin } from '@/lib/auth/dal';
import { parseBody, parseParams, withErrorHandling } from '@/lib/http';
import {
  deleteService,
  editService,
  getServiceForAdmin,
  setServicePublished,
} from '@/lib/services/services';

export const GET = withErrorHandling(
  async (_, { params }: RouteContext<'/api/services/[id]'>) => {
    await requireAdmin();
    const { id } = await parseParams(params, serviceIdParamsSchema);
    const service = await getServiceForAdmin(id);
    return Response.json({ service } satisfies ServiceResponse);
  },
);

export const PUT = withErrorHandling(
  async (request, { params }: RouteContext<'/api/services/[id]'>) => {
    await requireAdmin();
    const { id } = await parseParams(params, serviceIdParamsSchema);
    const body = await parseBody(request, serviceSchema);
    const serviceId = await editService(id, body);
    return Response.json({ id: serviceId } satisfies ServiceIdResponse);
  },
);

export const PATCH = withErrorHandling(
  async (request, { params }: RouteContext<'/api/services/[id]'>) => {
    await requireAdmin();
    const { id } = await parseParams(params, serviceIdParamsSchema);
    const { isPublished } = await parseBody(request, servicePublishSchema);
    await setServicePublished(id, isPublished);
    return new Response(null, { status: 204 });
  },
);

export const DELETE = withErrorHandling(
  async (_, { params }: RouteContext<'/api/services/[id]'>) => {
    await requireAdmin();
    const { id } = await parseParams(params, serviceIdParamsSchema);
    const serviceId = await deleteService(id);
    return Response.json({ id: serviceId } satisfies ServiceIdResponse);
  },
);
