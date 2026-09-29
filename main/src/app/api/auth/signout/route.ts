import { signout } from '@/lib/auth/auth';
import { deleteSessionCookie } from '@/lib/auth/cookies';
import { getCurrentSession } from '@/lib/auth/dal';
import { withErrorHandling } from '@/lib/http';

export const POST = withErrorHandling(async () => {
  const currentSession = await getCurrentSession();
  if (currentSession) await signout(currentSession.session.id);

  await deleteSessionCookie();

  return new Response(null, { status: 204 });
});