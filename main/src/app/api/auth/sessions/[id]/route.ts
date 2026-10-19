import { sessionIdParamsSchema } from '@granat/contracts';

import { deleteSessionCookie } from '@/lib/auth/cookies';
import { requireUser } from '@/lib/auth/dal';
import { invalidateUserSession } from '@/lib/auth/session';
import { parseParams, withErrorHandling } from '@/lib/http';

export const DELETE = withErrorHandling(
  async (_request, { params }: RouteContext<'/api/auth/sessions/[id]'>) => {
    const { user, session } = await requireUser();
    const { id } = await parseParams(params, sessionIdParamsSchema);

    await invalidateUserSession(user.id, id);
    if (id === session.id) await deleteSessionCookie();

    return new Response(null, { status: 204 });
  },
);
