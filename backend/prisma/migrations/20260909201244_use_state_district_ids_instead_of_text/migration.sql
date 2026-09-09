/*
  Warnings:

  - You are about to drop the column `requestedDistrict` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `requestedState` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "requestedDistrict",
DROP COLUMN "requestedState",
ADD COLUMN     "requestedDistrictId" UUID,
ADD COLUMN     "requestedStateId" UUID;
