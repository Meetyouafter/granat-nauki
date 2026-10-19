import 'server-only';

import {
  ACCESS_REQUESTS_PAGE_SIZE,
  type AccessRequestDecision,
  type AccessRequestsQuery,
  API_STATUSES,
} from '@granat/contracts';

import { invalidateUserSessions } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { AppError } from '@/lib/errors';

const accessRequestSelect = { status: true, createdAt: true } as const;

const accessRequestAdminSelect = {
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  user: { select: { id: true, email: true } },
} as const;

export const getAllAccessRequests = async (query: AccessRequestsQuery) => {
  const { sort, direction, status, page } = query;
  const where = status === 'ALL' ? {} : { status };

  const [accessRequests, total] = await prisma.$transaction([
    prisma.accessRequest.findMany({
      where,
      orderBy: [
        sort === 'email' ? { user: { email: direction } } : { createdAt: direction },
        { id: direction },
      ],
      skip: (page - 1) * ACCESS_REQUESTS_PAGE_SIZE,
      take: ACCESS_REQUESTS_PAGE_SIZE,
      select: accessRequestAdminSelect,
    }),
    prisma.accessRequest.count({ where }),
  ]);

  return { accessRequests, total, totalPages: Math.ceil(total / ACCESS_REQUESTS_PAGE_SIZE) };
};

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

export const decideAccessRequest = (id: number, decision: AccessRequestDecision) =>
  prisma.$transaction(async (tx) => {
    const accessRequest = await tx.accessRequest.findUnique({
      where: { id },
      select: { userId: true, status: true },
    });
    if (!accessRequest) throw new AppError(API_STATUSES.ACCESS_REQUEST_NOT_FOUND);
    if (accessRequest.status !== 'PENDING') {
      throw new AppError(API_STATUSES.ACCESS_REQUEST_ALREADY_DECIDED);
    }

    const { count } = await tx.accessRequest.updateMany({
      where: { id, status: 'PENDING' },
      data: { status: decision },
    });
    if (count === 0) throw new AppError(API_STATUSES.ACCESS_REQUEST_ALREADY_DECIDED);

    if (decision === 'APPROVED') {
      await tx.user.update({ where: { id: accessRequest.userId }, data: { role: 'ADMIN' } });
      await invalidateUserSessions(accessRequest.userId, tx);
    }

    return tx.accessRequest.findUniqueOrThrow({
      where: { id },
      select: accessRequestAdminSelect,
    });
  });
