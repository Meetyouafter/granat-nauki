import { hashPassword } from '@/lib/auth/password';
import { signupSchema } from '@/lib/auth/schemas';
import { invalidateUserSessions } from '@/lib/auth/session';
import { prisma } from '@/lib/db';

const main = async () => {
  const { email, password } = signupSchema.parse({
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  });

  const passwordHash = await hashPassword(password);

  const admin = await prisma.$transaction(async (tx) => {
    const user = await tx.user.upsert({
      where: { email },
      create: { email, passwordHash, role: 'ADMIN' },
      update: { role: 'ADMIN' },
    });
    await invalidateUserSessions(user.id, tx);
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
