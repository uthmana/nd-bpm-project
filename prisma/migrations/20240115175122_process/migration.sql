/*
  Warnings:

  - You are about to drop the column `processDate` on the `Process` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Process` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[faultControlId]` on the table `Fault` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[machineId]` on the table `Process` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Process` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProcessStatus" AS ENUM ('PENDING', 'PROCESSING', 'FINISHED');

-- DropForeignKey
ALTER TABLE "Process" DROP CONSTRAINT "Process_faultId_fkey";

-- DropForeignKey
ALTER TABLE "Process" DROP CONSTRAINT "Process_machineId_fkey";

-- DropForeignKey
ALTER TABLE "Process" DROP CONSTRAINT "Process_userId_fkey";

-- DropForeignKey
ALTER TABLE "TechnicalParameter" DROP CONSTRAINT "TechnicalParameter_machineId_fkey";

-- AlterTable
ALTER TABLE "Process" DROP COLUMN "processDate",
DROP COLUMN "userId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "machineName" TEXT,
ADD COLUMN     "plating" TEXT,
ADD COLUMN     "product" TEXT,
ADD COLUMN     "productCode" TEXT,
ADD COLUMN     "quantity" INTEGER,
ADD COLUMN     "status" "ProcessStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "faultId" DROP NOT NULL,
ALTER COLUMN "machineId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TechnicalParameter" ADD COLUMN     "processId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Fault_faultControlId_key" ON "Fault"("faultControlId");

-- CreateIndex
CREATE UNIQUE INDEX "Process_machineId_key" ON "Process"("machineId");

-- AddForeignKey
ALTER TABLE "TechnicalParameter" ADD CONSTRAINT "TechnicalParameter_processId_fkey" FOREIGN KEY ("processId") REFERENCES "Process"("id") ON DELETE SET NULL ON UPDATE CASCADE;
