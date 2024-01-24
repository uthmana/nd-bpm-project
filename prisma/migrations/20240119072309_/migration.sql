/*
  Warnings:

  - Made the column `faultId` on table `Process` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Process" ALTER COLUMN "faultId" SET NOT NULL;

-- CreateTable
CREATE TABLE "MachineParams" (
    "id" TEXT NOT NULL,
    "param_name" TEXT,
    "display_name" TEXT,
    "machineId" TEXT,

    CONSTRAINT "MachineParams_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MachineParams" ADD CONSTRAINT "MachineParams_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE SET NULL ON UPDATE CASCADE;
