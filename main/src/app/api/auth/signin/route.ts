import { signin, signout } from '@/lib/auth/auth';
import { setSessionCookie } from '@/lib/auth/cookies';
import { getCurrentSession } from '@/lib/auth/dal';
import { signinSchema } from '@/lib/auth/schemas';
import { parseBody, withErrorHandling } from '@/lib/http';

export const POST = withErrorHandling(async (request) => {
  const body = await parseBody(request, signinSchema);
  const session = await signin(body);

  const currentSession = await getCurrentSession();
  if (currentSession) await signout(currentSession.session.id);

  await setSessionCookie(session.token, session.expiresAt);

  return new Response(null, { status: 204 });
});
