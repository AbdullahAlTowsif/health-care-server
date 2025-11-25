/*
  Warnings:

  - Added the required column `updatedAt` to the `doctor_specialties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `specialties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- ALTER TABLE "doctor_specialties" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
-- ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- -- AlterTable
-- ALTER TABLE "specialties" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
-- ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;


-- Add createdAt with default value and updatedAt as nullable first
ALTER TABLE "doctor_specialties" 
ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "updatedAt" TIMESTAMP(3);

ALTER TABLE "specialties" 
ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "updatedAt" TIMESTAMP(3);

-- Set updatedAt values for existing rows
UPDATE "doctor_specialties" SET "updatedAt" = CURRENT_TIMESTAMP;
UPDATE "specialties" SET "updatedAt" = CURRENT_TIMESTAMP;

-- Now make updatedAt required
ALTER TABLE "doctor_specialties" ALTER COLUMN "updatedAt" SET NOT NULL;
ALTER TABLE "specialties" ALTER COLUMN "updatedAt" SET NOT NULL;