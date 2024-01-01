/*
  Warnings:

  - You are about to drop the column `Application` on the `Fault` table. All the data in the column will be lost.
  - You are about to drop the column `ArrivalDate` on the `Fault` table. All the data in the column will be lost.
  - You are about to drop the column `CleaningRequired` on the `Fault` table. All the data in the column will be lost.
  - You are about to drop the column `CoatingControl` on the `Fault` table. All the data in the column will be lost.
  - You are about to drop the column `Color` on the `Fault` table. All the data in the column will be lost.
  - You are about to drop the column `ConfirmationEvidence` on the `Fault` table. All the data in the column will be lost.
  - You are about to drop the column `CustomerName` on the `Fault` table. All the data in the column will be lost.
  - You are about to drop the column `FaultDescription` on the `Fault` table. All the data in the column will be lost.
  - You are about to drop the column `InvoiceDate` on the `Fault` table. All the data in the column will be lost.
  - You are about to drop the column `MachineID` on the `Fault` table. All the data in the column will be lost.
  - You are about to drop the column `MachineUserID` on the `Fault` table. All the data in the column will be lost.
  - You are about to drop the column `MixedMaterial` on the `Fault` table. All the data in the column will be lost.
  - You are about to drop the column `ProcessControlFrequency` on the `Fault` table. All the data in the column will be lost.
  - You are about to drop the column `Product` on the `Fault` table. All the data in the column will be lost.
  - You are about to drop the column `ProductBatchNumber` on the `Fault` table. All the data in the column will be lost.
  - You are about to drop the column `ProductCode` on the `Fault` table. All the data in the column will be lost.
  - You are about to drop the column `Quantity` on the `Fault` table. All the data in the column will be lost.
  - You are about to drop the column `ServiceCompletion` on the `Fault` table. All the data in the column will be lost.
  - You are about to drop the column `ServiceParameters` on the `Fault` table. All the data in the column will be lost.
  - You are about to drop the column `Standard` on the `Fault` table. All the data in the column will be lost.
  - You are about to drop the column `SuperUserConfirmation` on the `Fault` table. All the data in the column will be lost.
  - You are about to drop the column `SuperUserID` on the `Fault` table. All the data in the column will be lost.
  - You are about to drop the column `TechnicalDrawingAttachment` on the `Fault` table. All the data in the column will be lost.
  - You are about to drop the column `Timestamp` on the `Fault` table. All the data in the column will be lost.
  - You are about to drop the column `TraceabilityCode` on the `Fault` table. All the data in the column will be lost.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `traceabilityCode` to the `Fault` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotifStatus" AS ENUM ('READ', 'NOT_READ');

-- CreateEnum
CREATE TYPE "NotifReceiver" AS ENUM ('SUPER', 'NORMAL', 'TECH');

-- CreateEnum
CREATE TYPE "FaultControlResult" AS ENUM ('ACCEPT', 'ACCEPTANCE_WITH_CONDITION', 'PRE_PROCESS', 'REJECT');

-- CreateEnum
CREATE TYPE "FaultStatus" AS ENUM ('PENDING', 'UNDERCONTROL', 'FaultControlResult');

-- AlterTable
ALTER TABLE "Fault" DROP COLUMN "Application",
DROP COLUMN "ArrivalDate",
DROP COLUMN "CleaningRequired",
DROP COLUMN "CoatingControl",
DROP COLUMN "Color",
DROP COLUMN "ConfirmationEvidence",
DROP COLUMN "CustomerName",
DROP COLUMN "FaultDescription",
DROP COLUMN "InvoiceDate",
DROP COLUMN "MachineID",
DROP COLUMN "MachineUserID",
DROP COLUMN "MixedMaterial",
DROP COLUMN "ProcessControlFrequency",
DROP COLUMN "Product",
DROP COLUMN "ProductBatchNumber",
DROP COLUMN "ProductCode",
DROP COLUMN "Quantity",
DROP COLUMN "ServiceCompletion",
DROP COLUMN "ServiceParameters",
DROP COLUMN "Standard",
DROP COLUMN "SuperUserConfirmation",
DROP COLUMN "SuperUserID",
DROP COLUMN "TechnicalDrawingAttachment",
DROP COLUMN "Timestamp",
DROP COLUMN "TraceabilityCode",
ADD COLUMN     "application" TEXT,
ADD COLUMN     "arrivalDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "color" TEXT,
ADD COLUMN     "controlInfo" TEXT,
ADD COLUMN     "customerName" TEXT,
ADD COLUMN     "faultDescription" TEXT,
ADD COLUMN     "invoiceDate" TIMESTAMP(3),
ADD COLUMN     "product" TEXT,
ADD COLUMN     "productBatchNumber" TEXT,
ADD COLUMN     "productCode" TEXT,
ADD COLUMN     "quantity" INTEGER,
ADD COLUMN     "standard" TEXT,
ADD COLUMN     "status" "FaultStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "technicalDrawingAttachment" TEXT,
ADD COLUMN     "traceabilityCode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'NORMAL',
DROP COLUMN "status",
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "FaultControl" (
    "id" TEXT NOT NULL,
    "faultId" TEXT NOT NULL,
    "customerName" TEXT,
    "traceabilityCode" TEXT,
    "arrivalDate" TIMESTAMP(3),
    "invoiceDate" TIMESTAMP(3),
    "product" TEXT,
    "quantity" INTEGER,
    "productCode" TEXT,
    "productBatchNumber" TEXT,
    "headStyle" TEXT,
    "plating" TEXT,
    "controlDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "materialMixing" TEXT NOT NULL DEFAULT 'Karışık Malzema',
    "materialMixingQty" INTEGER,
    "materialMixingUnqualifiedQty" INTEGER,
    "materialMixingUnqualifiedPercent" INTEGER,
    "materialMixingRemarks" TEXT,
    "bubble" TEXT NOT NULL DEFAULT 'Kabarcık',
    "bubbleQty" INTEGER,
    "bubbleUnqualifiedQty" INTEGER,
    "bubbleUnqualifiedPercent" INTEGER,
    "bubbleRemarks" TEXT,
    "damagedThreads" TEXT NOT NULL DEFAULT 'Ezık Dişler',
    "damagedThreadsQty" INTEGER,
    "damagedThreadsUnqualifiedQty" INTEGER,
    "damagedThreadsUnqualifiedPercent" INTEGER,
    "damagedThreadsRemarks" TEXT,
    "dirtyThreads" TEXT NOT NULL DEFAULT 'Kırlı Dişler',
    "dirtyThreadsQty" INTEGER,
    "dirtyThreadsUnqualifiedQty" INTEGER,
    "dirtyThreadsUnqualifiedPercent" INTEGER,
    "dirtyThreadsRemarks" TEXT,
    "platingDefects" TEXT NOT NULL DEFAULT 'Kaplama Hataları',
    "platingDefectsQty" INTEGER,
    "platingDefectsUnqualifiedQty" INTEGER,
    "platingDefectsUnqualifiedPercent" INTEGER,
    "platingDefectsRemarks" TEXT,
    "rusty" TEXT NOT NULL DEFAULT 'Paslı',
    "rustyQty" INTEGER,
    "rustyUnqualifiedQty" INTEGER,
    "rustyUnqualifiedPercent" INTEGER,
    "rustyRemarks" TEXT,
    "discoloration" TEXT NOT NULL DEFAULT 'Renk Bozulması',
    "discolorationQty" INTEGER,
    "discolorationUnqualifiedQty" INTEGER,
    "discolorationUnqualifiedPercent" INTEGER,
    "discolorationRemarks" TEXT,
    "dusty" TEXT NOT NULL DEFAULT 'Tozlu',
    "dustyQty" INTEGER,
    "dustyUnqualifiedQty" INTEGER,
    "dustyUnqualifiedPercent" INTEGER,
    "dustyRemarks" TEXT,
    "other" TEXT NOT NULL DEFAULT 'Diğer',
    "otherQty" INTEGER,
    "otherUnqualifiedQty" INTEGER,
    "otherUnqualifiedPercent" INTEGER,
    "otherRemarks" TEXT,
    "result" "FaultControlResult" NOT NULL,

    CONSTRAINT "FaultControl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "receiver" "NotifReceiver" NOT NULL DEFAULT 'NORMAL',
    "link" TEXT,
    "status" "NotifStatus" NOT NULL DEFAULT 'NOT_READ',

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Applications" (
    "id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,

    CONSTRAINT "Applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Colors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Colors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Standards" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Standards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeadStyle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "HeadStyle_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FaultControl" ADD CONSTRAINT "FaultControl_id_fkey" FOREIGN KEY ("id") REFERENCES "Fault"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
