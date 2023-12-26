/*
  Warnings:

  - The values [INACTIVE,PENDING] on the enum `UserStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `roleId` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the `Todo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('SENT', 'PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('TL', 'USD');

-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('ALICI_SATICI', 'ALICI', 'SATICI');

-- AlterEnum
BEGIN;
CREATE TYPE "UserStatus_new" AS ENUM ('ACTIVE', 'PASSIVE');
ALTER TYPE "UserStatus" RENAME TO "UserStatus_old";
ALTER TYPE "UserStatus_new" RENAME TO "UserStatus";
DROP TYPE "UserStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "roleId",
ADD COLUMN     "cardType" "CardType" DEFAULT 'ALICI_SATICI',
ADD COLUMN     "code" TEXT,
ADD COLUMN     "currency" "Currency" DEFAULT 'TL',
ADD COLUMN     "definition" TEXT,
ADD COLUMN     "phoneNumber2" TEXT,
ADD COLUMN     "taxNo" TEXT,
ADD COLUMN     "tax_Office" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "token" TEXT;

-- DropTable
DROP TABLE "Todo";

-- DropTable
DROP TABLE "VerificationRequest";

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "OfferStatus" NOT NULL DEFAULT 'PENDING',
    "customerId" TEXT NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);
