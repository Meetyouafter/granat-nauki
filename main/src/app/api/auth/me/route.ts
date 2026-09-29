import { requireUser } from '@/lib/auth/dal';
import { withErrorHandling } from '@/lib/http';

export const GET = withErrorHandling(async () => {
  const { user } = await requireUser();
  return Response.json({ user });
});
