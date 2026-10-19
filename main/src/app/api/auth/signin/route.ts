import { signinSchema } from '@granat/contracts';

import { signin } from '@/lib/auth/auth';
import { setSessionCookie } from '@/lib/auth/cookies';
import { endCurrentSession } from '@/lib/auth/dal';
import { AppError } from '@/lib/errors';
import { getClientIp, parseBody, withErrorHandling } from '@/lib/http';
import { signinLimiter } from '@/lib/rateLimit';

export const POST = withErrorHandling(async (request) => {
  await endCurrentSession();

  const body = await parseBody(request, signinSchema);
  const ip = getClientIp(request);

  signinLimiter.byIp.check(ip);
  signinLimiter.byEmail.check(body.email);

  try {
    const session = await signin(body);
    signinLimiter.byEmail.reset(body.email);
    await setSessionCookie(session.token, session.expiresAt);

    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof AppError && error.code === 'INVALID_CREDENTIALS') {
      signinLimiter.byIp.hit(ip);
      signinLimiter.byEmail.hit(body.email);
    }
    throw error;
  }
});
