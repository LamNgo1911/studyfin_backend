-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerifyExpiresAt" TIMESTAMP(3),
ADD COLUMN     "emailVerifyToken" TEXT,
ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiresAt" TIMESTAMP(3);
