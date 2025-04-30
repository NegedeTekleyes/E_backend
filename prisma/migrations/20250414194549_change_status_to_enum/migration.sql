-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED');

-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';
