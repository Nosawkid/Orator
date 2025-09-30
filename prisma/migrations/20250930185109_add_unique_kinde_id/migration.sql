/*
  Warnings:

  - A unique constraint covering the columns `[kindeId]` on the table `UserSubscription` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserSubscription_kindeId_key" ON "UserSubscription"("kindeId");
