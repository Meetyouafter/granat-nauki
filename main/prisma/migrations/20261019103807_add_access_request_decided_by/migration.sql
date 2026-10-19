-- AlterTable
ALTER TABLE "access_requests" ADD COLUMN     "decided_by_id" INTEGER;

-- CreateIndex
CREATE INDEX "access_requests_decided_by_id_idx" ON "access_requests"("decided_by_id");

-- AddForeignKey
ALTER TABLE "access_requests" ADD CONSTRAINT "access_requests_decided_by_id_fkey" FOREIGN KEY ("decided_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
