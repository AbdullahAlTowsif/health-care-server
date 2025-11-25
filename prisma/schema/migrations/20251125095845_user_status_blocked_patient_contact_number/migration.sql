-- AlterEnum
ALTER TYPE "UserStatus" ADD VALUE 'BLOCKED';

-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "contactNumber" TEXT;
