import 'server-only';

import type { Locale } from 'next-intl';

import { API_STATUSES, type ServiceInput } from '@granat/contracts';

import { prisma } from '@/lib/db';
import { AppError } from '@/lib/errors';

export const getServicesForClient = async (locale: Locale) => {
  const rows = await prisma.service.findMany({
    where: { isPublished: true },
    orderBy: { order: 'asc' },
    select: {
      id: true,
      titleRu: true,
      titleEn: true,
      descriptionRu: true,
      descriptionEn: true,
      price: true,
      duration: true,
    },
  });

  return rows.map(s => ({
    id: s.id,
    title: locale === 'ru' ? s.titleRu : s.titleEn,
    description: locale === 'ru' ? s.descriptionRu : s.descriptionEn,
    price: s.price,
    duration: s.duration,
  }));
};

export const getServicesPreviewForAdmin = async () => {
  const rows = await prisma.service.findMany({
    orderBy: { order: 'asc' },
    select: {
      id: true,
      titleRu: true,
      descriptionRu: true,
      price: true,
      duration: true,
      isPublished: true,
    },
  });

  return rows.map(s => ({
    id: s.id,
    title: s.titleRu,
    description: s.descriptionRu,
    price: s.price,
    duration: s.duration,
    isPublished: s.isPublished,
  }));
};

export const getServiceForAdmin = async (id: string) => {
  const service = await prisma.service.findUnique({
    where: { id },
    select: {
      id: true,
      titleRu: true,
      titleEn: true,
      descriptionRu: true,
      descriptionEn: true,
      price: true,
      duration: true,
      isPublished: true,
    },
  });
  if (!service) throw new AppError(API_STATUSES.RESOURCE_NOT_FOUND);

  return service;
};

export const createService = async (input: ServiceInput) => {
  const { _max } = await prisma.service.aggregate({ _max: { order: true } });

  return prisma.service.create({
    data: { ...input, order: (_max.order ?? -1) + 1 },
    select: { id: true },
  });
};

export const editService = async (id: string, input: ServiceInput) => {
  const { count } = await prisma.service.updateMany({ where: { id }, data: input });
  if (count === 0) throw new AppError(API_STATUSES.RESOURCE_NOT_FOUND);
  return id;
};

export const setServicePublished = async (id: string, isPublished: boolean) => {
  const { count } = await prisma.service.updateMany({ where: { id }, data: { isPublished } });
  if (count === 0) throw new AppError(API_STATUSES.RESOURCE_NOT_FOUND);
};

export const deleteService = async (id: string) => {
  const { count } = await prisma.service.deleteMany({ where: { id } });
  if (count === 0) throw new AppError(API_STATUSES.RESOURCE_NOT_FOUND);
  return id;
};

export const reorderServices = async (ids: string[]) => {
  await prisma.$transaction(async (tx) => {
    const total = await tx.service.count();
    if (new Set(ids).size !== ids.length || ids.length !== total) {
      throw new AppError(API_STATUSES.VALIDATION_ERROR);
    }

    for (const [index, id] of ids.entries()) {
      const { count } = await tx.service.updateMany({ where: { id }, data: { order: index } });
      if (count === 0) throw new AppError(API_STATUSES.VALIDATION_ERROR);
    }
  });
};
