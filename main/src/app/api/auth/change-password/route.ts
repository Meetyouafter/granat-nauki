import { changePasswordSchema } from '@granat/contracts';

import { changePassword } from '@/lib/auth/auth';
import { setSessionCookie } from '@/lib/auth/cookies';
import { requireUser } from '@/lib/auth/dal';
import { AppError } from '@/lib/errors';
import { getSessionMeta, parseBody, withErrorHandling } from '@/lib/http';
import { changePasswordLimiter } from '@/lib/rateLimit';

export const POST = withErrorHandling(async (request) => {
  const { user } = await requireUser();
  const body = await parseBody(request, changePasswordSchema);
  const limiterKey = String(user.id);

  changePasswordLimiter.check(limiterKey);

  try {
    const session = await changePassword(user.id, body, getSessionMeta(request));
    changePasswordLimiter.reset(limiterKey);
    await setSessionCookie(session.token, session.expiresAt);

    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof AppError && error.code === 'INVALID_CREDENTIALS') {
      changePasswordLimiter.hit(limiterKey);
    }
    throw error;
  }
});
