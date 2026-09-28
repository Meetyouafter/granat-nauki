import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth/password';
import { normalizeEmail } from '@/lib/auth/normalizeEmail';
import { isEmailValid, isPasswordValid } from '@/lib/auth/validate';
import { invalidateUserSessions } from '@/lib/auth/session';

const main = async () => {
  const email = normalizeEmail(process.env.ADMIN_EMAIL ?? '');
  const password = process.env.ADMIN_PASSWORD ?? '';

  if (!isEmailValid(email) || !isPasswordValid(password)) {
    throw new Error('check ADMIN_EMAIL and ADMIN_PASSWORD');    
  }

  const passwordHash = await hashPassword(password);

  const admin = await prisma.$transaction(async (tx) => {
    const user = await tx.user.upsert({
      where: { email },
      create: { email, passwordHash, role: 'ADMIN' },
      update: { role: 'ADMIN' },
    });
    await invalidateUserSessions(user.id);
    return user;
  });

  console.log(`Admin ready: ${admin.email} (id=${admin.id})`);
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
