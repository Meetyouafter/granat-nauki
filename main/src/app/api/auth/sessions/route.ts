import type { SessionsResponse } from '@granat/contracts';

import { requireUser } from '@/lib/auth/dal';
import { invalidateOtherUserSessions, listUserSessions } from '@/lib/auth/session';
import { withErrorHandling } from '@/lib/http';

export const GET = withErrorHandling(async () => {
  const { user, session: current } = await requireUser();
  const sessions = await listUserSessions(user.id);

  return Response.json({
    sessions: sessions.map(({ lastVerifiedAt, createdAt, ...session }) => ({
      ...session,
      createdAt: createdAt.toISOString(),
      lastActiveAt: lastVerifiedAt.toISOString(),
      isCurrent: session.id === current.id,
    })),
  } satisfies SessionsResponse);
});

export const DELETE = withErrorHandling(async () => {
  const { user, session } = await requireUser();
  await invalidateOtherUserSessions(user.id, session.id);

  return new Response(null, { status: 204 });
});
