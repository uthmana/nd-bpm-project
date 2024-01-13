/*
  Warnings:

  - You are about to drop the column `MachineName` on the `Machine` table. All the data in the column will be lost.
  - You are about to drop the column `MachineID` on the `TechnicalParameter` table. All the data in the column will be lost.
  - You are about to drop the column `ParameterName` on the `TechnicalParameter` table. All the data in the column will be lost.
  - You are about to drop the column `ParameterValue` on the `TechnicalParameter` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[machineId]` on the table `TechnicalParameter` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `machine_Name` to the `Machine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Machine" DROP COLUMN "MachineName",
ADD COLUMN     "machine_Name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TechnicalParameter" DROP COLUMN "MachineID",
DROP COLUMN "ParameterName",
DROP COLUMN "ParameterValue",
ADD COLUMN     "besleme_Hizi" TEXT,
ADD COLUMN     "besleme_Tipi" TEXT,
ADD COLUMN     "delay_Ayari" TEXT,
ADD COLUMN     "firin_Bant_Hizi" TEXT,
ADD COLUMN     "hava_Basinci" TEXT,
ADD COLUMN     "induksiyon_Volts" TEXT,
ADD COLUMN     "induksiyon_kHz" TEXT,
ADD COLUMN     "induksiyon_kW" TEXT,
ADD COLUMN     "kesim_Mesafesi" TEXT,
ADD COLUMN     "machineId" TEXT,
ADD COLUMN     "makine_Hizi" TEXT,
ADD COLUMN     "patch_Hava_Basinci" TEXT,
ADD COLUMN     "patch_Toz_yukleme_Hizi" TEXT,
ADD COLUMN     "patch_Vibrasyon_hizi" TEXT,
ADD COLUMN     "purge_Ayari" TEXT,
ADD COLUMN     "teach_Ayari" TEXT,
ADD COLUMN     "testere_secimi" TEXT,
ADD COLUMN     "viskozite" TEXT,
ADD COLUMN     "yuva_Boyutu" TEXT;

-- CreateTable
CREATE TABLE "Process" (
    "id" TEXT NOT NULL,
    "faultId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "processDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "machineId" TEXT NOT NULL,

    CONSTRAINT "Process_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinalControl" (
    "id" TEXT NOT NULL,
    "olcu_Kontrol" TEXT,
    "gorunum_kontrol" TEXT,
    "tork_Kontrol" TEXT,
    "paketleme" TEXT,
    "kontrol_edilen_miktar" TEXT,
    "hatali_miktar" TEXT,
    "remarks" TEXT,
    "result" "FaultControlResult" NOT NULL,

    CONSTRAINT "FinalControl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "faultId" TEXT NOT NULL,
    "invoiceDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalAmount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TechnicalParameter_machineId_key" ON "TechnicalParameter"("machineId");

-- AddForeignKey
ALTER TABLE "TechnicalParameter" ADD CONSTRAINT "TechnicalParameter_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Process" ADD CONSTRAINT "Process_faultId_fkey" FOREIGN KEY ("faultId") REFERENCES "Fault"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Process" ADD CONSTRAINT "Process_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Process" ADD CONSTRAINT "Process_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_faultId_fkey" FOREIGN KEY ("faultId") REFERENCES "Fault"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
