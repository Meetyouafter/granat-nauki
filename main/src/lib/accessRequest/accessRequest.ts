import 'server-only';

import { API_STATUSES } from '@granat/contracts';

import { prisma } from '@/lib/db';
import { AppError } from '@/lib/errors';

const accessRequestSelect = { status: true, createdAt: true } as const;

export const getLatestAccessRequest = (userId: number) =>
  prisma.accessRequest.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: accessRequestSelect,
  });

export const createAccessRequest = (userId: number) =>
  prisma.$transaction(async (tx) => {
    const pending = await tx.accessRequest.findFirst({
      where: { userId, status: 'PENDING' },
      select: { id: true },
    });
    if (pending) throw new AppError(API_STATUSES.ACCESS_REQUEST_PENDING);

    return tx.accessRequest.create({
      data: { userId },
      select: accessRequestSelect,
    });
  });
