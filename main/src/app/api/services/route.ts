import {
  type ServiceIdResponse,
  serviceSchema,
  type ServicesPreviewResponse,
} from '@granat/contracts';

import { requireAdmin } from '@/lib/auth/dal';
import { parseBody, withErrorHandling } from '@/lib/http';
import { createService, getServicesPreviewForAdmin } from '@/lib/services/services';

export const GET = withErrorHandling(async () => {
  await requireAdmin();

  const services = await getServicesPreviewForAdmin();

  return Response.json({ data: services } satisfies ServicesPreviewResponse);
});

export const POST = withErrorHandling(async (request) => {
  await requireAdmin();

  const body = await parseBody(request, serviceSchema);
  const { id } = await createService(body);

  return Response.json({ id } satisfies ServiceIdResponse, { status: 201 });
});
