import { deleteSessionCookie } from '@/lib/auth/cookies';
import { endCurrentSession } from '@/lib/auth/dal';
import { withErrorHandling } from '@/lib/http';

export const POST = withErrorHandling(async () => {
  await endCurrentSession();
  await deleteSessionCookie();

  return new Response(null, { status: 204 });
});
