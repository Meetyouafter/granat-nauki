import { servicesOrderSchema } from '@granat/contracts';

import { requireAdmin } from '@/lib/auth/dal';
import { parseBody, withErrorHandling } from '@/lib/http';
import { reorderServices } from '@/lib/services/services';

export const PUT = withErrorHandling(async (request) => {
  await requireAdmin();

  const { ids } = await parseBody(request, servicesOrderSchema);
  await reorderServices(ids);

  return new Response(null, { status: 204 });
});
