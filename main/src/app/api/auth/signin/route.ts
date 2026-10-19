import { signinSchema } from '@granat/contracts';

import { signin } from '@/lib/auth/auth';
import { setSessionCookie } from '@/lib/auth/cookies';
import { endCurrentSession } from '@/lib/auth/dal';
import { parseBody, withErrorHandling } from '@/lib/http';

export const POST = withErrorHandling(async (request) => {
  await endCurrentSession();

  const body = await parseBody(request, signinSchema);
  const session = await signin(body);

  await setSessionCookie(session.token, session.expiresAt);

  return new Response(null, { status: 204 });
});
