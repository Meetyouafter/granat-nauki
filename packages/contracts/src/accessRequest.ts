export const ACCESS_REQUEST_STATUSES = ['PENDING', 'APPROVED', 'REJECTED'] as const;

export type AccessRequestStatus = (typeof ACCESS_REQUEST_STATUSES)[number];

export type AccessRequestDto = { status: AccessRequestStatus; createdAt: string };
export type MyAccessRequestResponse = {
  status: AccessRequestStatus | null; createdAt: string | null;
};
