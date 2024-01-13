-- CreateEnum
CREATE TYPE "NotifStatus" AS ENUM ('READ', 'NOT_READ');

-- CreateEnum
CREATE TYPE "NotifReceiver" AS ENUM ('SUPER', 'NORMAL', 'TECH', 'OTHER');

-- CreateEnum
CREATE TYPE "FaultControlResult" AS ENUM ('ACCEPT', 'ACCEPTANCE_WITH_CONDITION', 'PRE_PROCESS', 'REJECT');

-- CreateEnum
CREATE TYPE "FaultStatus" AS ENUM ('PENDING', 'ACCEPT', 'ACCEPTANCE_WITH_CONDITION', 'PRE_PROCESS', 'REJECT');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'SUPER', 'NORMAL', 'TECH');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'PASSIVE');

-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('SENT', 'PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('TL', 'USD', 'EUR');

-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('ALICI_SATICI', 'ALICI', 'SATICI');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'NORMAL',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "token" TEXT,
    "tokenExpiryDate" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactInfo" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ContactInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "code" TEXT,
    "cardType" "CardType" DEFAULT 'ALICI_SATICI',
    "taxNo" TEXT,
    "company_name" TEXT,
    "address" TEXT,
    "postalCode" TEXT,
    "phoneNumber" TEXT,
    "phoneNumber2" TEXT,
    "tax_Office" TEXT,
    "taxOfficeCode" TEXT,
    "email" TEXT,
    "email_2" TEXT,
    "rep_name" TEXT NOT NULL,
    "currency" "Currency" DEFAULT 'TL',
    "country_code" TEXT NOT NULL,
    "province_code" TEXT NOT NULL,
    "district_code" TEXT NOT NULL,
    "definition" TEXT,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stock" (
    "id" TEXT NOT NULL,
    "product_code" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "product_barcode" TEXT,
    "description" TEXT,
    "main_group" TEXT,
    "group1" TEXT,
    "group2" TEXT,
    "inventory" INTEGER,
    "unit" TEXT,
    "current_price" TEXT NOT NULL,
    "curency" TEXT NOT NULL,
    "brand" TEXT,
    "date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "image" TEXT,
    "customerId" TEXT,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "OfferStatus" NOT NULL DEFAULT 'PENDING',
    "customerId" TEXT NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fault" (
    "id" TEXT NOT NULL,
    "customerName" TEXT,
    "traceabilityCode" TEXT NOT NULL,
    "arrivalDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "invoiceDate" TIMESTAMP(3),
    "product" TEXT,
    "quantity" INTEGER,
    "productCode" TEXT,
    "productBatchNumber" TEXT,
    "application" TEXT,
    "standard" TEXT,
    "color" TEXT,
    "faultDescription" TEXT,
    "status" "FaultStatus" NOT NULL DEFAULT 'PENDING',
    "technicalDrawingAttachment" TEXT,
    "controlInfo" TEXT,
    "customerId" TEXT,
    "faultControlId" TEXT,

    CONSTRAINT "Fault_pkey" PRIMARY KEY ("id")
);

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
    "plating" TEXT,
    "controlDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "image" TEXT,
    "productDimension" TEXT,
    "dimensionConfirmation" BOOLEAN,
    "quantityConfirmation" BOOLEAN,
    "dirtyThreads" BOOLEAN DEFAULT false,
    "processFrequency" TEXT,
    "remarks" TEXT,
    "result" "FaultControlResult" NOT NULL,

    CONSTRAINT "FaultControl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Machine" (
    "id" TEXT NOT NULL,
    "machine_Name" TEXT NOT NULL,

    CONSTRAINT "Machine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicalParameter" (
    "id" TEXT NOT NULL,
    "machineId" TEXT,
    "viskozite" TEXT,
    "besleme_Tipi" TEXT,
    "besleme_Hizi" TEXT,
    "makine_Hizi" TEXT,
    "hava_Basinci" TEXT,
    "firin_Bant_Hizi" TEXT,
    "induksiyon_kW" TEXT,
    "induksiyon_Volts" TEXT,
    "induksiyon_kHz" TEXT,
    "patch_Vibrasyon_hizi" TEXT,
    "patch_Hava_Basinci" TEXT,
    "patch_Toz_yukleme_Hizi" TEXT,
    "teach_Ayari" TEXT,
    "delay_Ayari" TEXT,
    "purge_Ayari" TEXT,
    "testere_secimi" TEXT,
    "kesim_Mesafesi" TEXT,
    "yuva_Boyutu" TEXT,

    CONSTRAINT "TechnicalParameter_pkey" PRIMARY KEY ("id")
);

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

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_token_key" ON "users"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Address_userId_key" ON "Address"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ContactInfo_userId_key" ON "ContactInfo"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TechnicalParameter_machineId_key" ON "TechnicalParameter"("machineId");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactInfo" ADD CONSTRAINT "ContactInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fault" ADD CONSTRAINT "Fault_faultControlId_fkey" FOREIGN KEY ("faultControlId") REFERENCES "FaultControl"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fault" ADD CONSTRAINT "Fault_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
