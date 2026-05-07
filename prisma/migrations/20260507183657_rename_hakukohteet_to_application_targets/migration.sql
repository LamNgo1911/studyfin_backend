/*
  Warnings:

  - You are about to drop the column `refreshToken` on the `Auth` table. All the data in the column will be lost.
  - Added the required column `refreshTokenHash` to the `Auth` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "Auth" DROP COLUMN "refreshToken",
ADD COLUMN     "refreshTokenHash" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "applicationTargets" JSONB,
ADD COLUMN     "duration" TEXT;

-- AlterTable
ALTER TABLE "University" ADD COLUMN     "descriptionMultilingual" JSONB,
ADD COLUMN     "nameMultilingual" JSONB;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hasTestAccess" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "GuidanceSection" (
    "id" TEXT NOT NULL,
    "programOid" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuidanceSection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GuidanceSection_programOid_idx" ON "GuidanceSection"("programOid");

-- CreateIndex
CREATE UNIQUE INDEX "GuidanceSection_programOid_key_key" ON "GuidanceSection"("programOid", "key");

-- AddForeignKey
ALTER TABLE "GuidanceSection" ADD CONSTRAINT "GuidanceSection_programOid_fkey" FOREIGN KEY ("programOid") REFERENCES "Program"("oid") ON DELETE CASCADE ON UPDATE CASCADE;
