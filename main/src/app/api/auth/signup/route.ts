import { signupSchema } from '@granat/contracts';

import { signup } from '@/lib/auth/auth';
import { setSessionCookie } from '@/lib/auth/cookies';
import { getClientIp, getSessionMeta, parseBody, withErrorHandling } from '@/lib/http';
import { signupLimiter } from '@/lib/rateLimit';

export const POST = withErrorHandling(async (request) => {
  const body = await parseBody(request, signupSchema);
  const ip = getClientIp(request);

  signupLimiter.check(ip);
  signupLimiter.hit(ip);

  const session = await signup(body, getSessionMeta(request));
  await setSessionCookie(session.token, session.expiresAt);

  return new Response(null, { status: 204 });
});
