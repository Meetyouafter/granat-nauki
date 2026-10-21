import type { ServiceInput } from './schemas/service';

export type ServiceDto = ServiceInput & { id: string };

export type ServicePreviewDto = {
  id: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  isPublished: boolean;
};

export type ServicesPreviewResponse = { data: ServicePreviewDto[] };
export type ServiceResponse = { service: ServiceDto };
export type ServiceIdResponse = { id: string };
