/*
  Warnings:

  - You are about to drop the column `plating` on the `Process` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[faultId]` on the table `Process` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Process" DROP COLUMN "plating",
ADD COLUMN     "application" TEXT,
ADD COLUMN     "color" TEXT,
ADD COLUMN     "customerName" TEXT,
ADD COLUMN     "standard" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Process_faultId_key" ON "Process"("faultId");
