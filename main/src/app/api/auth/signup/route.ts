import { signup } from '@/lib/auth/auth';
import { setSessionCookie } from '@/lib/auth/cookies';
import { signupSchema } from '@/lib/auth/schemas';
import { parseBody, withErrorHandling } from '@/lib/http';

export const POST = withErrorHandling(async (request) => {
  const body = await parseBody(request, signupSchema);
  const session = await signup(body);

  await setSessionCookie(session.token, session.expiresAt);

  return new Response(null, { status: 204 });
});
