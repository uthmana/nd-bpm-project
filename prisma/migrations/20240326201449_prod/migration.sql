-- CreateEnum
CREATE TYPE "FinalItemStatus" AS ENUM ('OK', 'NOT_OK');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('PENDING', 'ACTIVE', 'PAID', 'NOT_PAID');

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

-- CreateEnum
CREATE TYPE "ProcessStatus" AS ENUM ('PENDING', 'PROCESSING', 'FINISHED');

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
    "createdBy" TEXT,
    "updatedBy" TEXT,
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
    "cardType" "CardType" DEFAULT 'ALICI',
    "taxNo" TEXT,
    "company_name" TEXT,
    "address" TEXT,
    "postalCode" TEXT,
    "phoneNumber" TEXT,
    "phoneNumber_shipment" TEXT,
    "phoneNumber_quality" TEXT,
    "phoneNumber_accountant" TEXT,
    "email" TEXT,
    "email_quality" TEXT,
    "email_offer" TEXT,
    "email_accountant" TEXT,
    "tax_Office" TEXT,
    "taxOfficeCode" TEXT,
    "rep_name" TEXT NOT NULL,
    "currency" "Currency" DEFAULT 'TL',
    "country_code" TEXT NOT NULL,
    "province_code" TEXT NOT NULL,
    "district_code" TEXT NOT NULL,
    "definition" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stock" (
    "id" TEXT NOT NULL,
    "product_code" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "product_barcode" TEXT,
    "productBatchNumber" TEXT,
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
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "image" TEXT,
    "customerId" TEXT,
    "faultId" TEXT,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fault" (
    "id" TEXT NOT NULL,
    "customerName" TEXT,
    "arrivalDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "invoiceDate" TIMESTAMP(3),
    "product" TEXT,
    "product_barcode" TEXT,
    "quantity" INTEGER,
    "productCode" TEXT,
    "productBatchNumber" TEXT,
    "application" TEXT,
    "standard" TEXT,
    "color" TEXT,
    "faultDescription" TEXT,
    "status" "FaultStatus" NOT NULL DEFAULT 'PENDING',
    "technicalDrawingAttachment" TEXT,
    "customerId" TEXT,
    "faultControlId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,

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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "result" "FaultControlResult" NOT NULL,

    CONSTRAINT "FaultControl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Process" (
    "id" TEXT NOT NULL,
    "faultId" TEXT,
    "customerName" TEXT,
    "customerId" TEXT,
    "product" TEXT,
    "quantity" INTEGER,
    "shipmentQty" INTEGER,
    "productCode" TEXT,
    "application" TEXT,
    "standard" TEXT,
    "product_barcode" TEXT,
    "color" TEXT,
    "frequency" TEXT,
    "price" DOUBLE PRECISION,
    "technicalDrawingAttachment" TEXT,
    "machineName" TEXT,
    "machineId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "status" "ProcessStatus" NOT NULL DEFAULT 'PENDING',
    "invoiceId" TEXT,

    CONSTRAINT "Process_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinalControl" (
    "id" TEXT NOT NULL,
    "faultId" TEXT NOT NULL,
    "olcu_Kontrol" "FinalItemStatus",
    "gorunum_kontrol" "FinalItemStatus",
    "tork_Kontrol" "FinalItemStatus",
    "paketleme" TEXT,
    "kontrol_edilen_miktar" INTEGER,
    "hatali_miktar" INTEGER,
    "nakliye_miktar" INTEGER,
    "image" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "result" "FaultControlResult" NOT NULL,
    "processId" TEXT,

    CONSTRAINT "FinalControl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Machine" (
    "id" TEXT NOT NULL,
    "machine_Name" TEXT NOT NULL,

    CONSTRAINT "Machine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MachineParams" (
    "id" TEXT NOT NULL,
    "param_name" TEXT,
    "display_name" TEXT,
    "machineId" TEXT,

    CONSTRAINT "MachineParams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicalParameter" (
    "id" TEXT NOT NULL,
    "Ort_Uretim_saat" TEXT,
    "Makine_secimi" TEXT,
    "Viskozite" TEXT,
    "Besleme_Tipi" TEXT,
    "Besleme_Hizi" TEXT,
    "Makine_Hizi" TEXT,
    "Hava_Basinci" TEXT,
    "Firin_Bant_Hizi" TEXT,
    "Firin_Sicakligi" TEXT,
    "Induksiyon_kW" TEXT,
    "Induksiyon_Volts" TEXT,
    "Induksiyon_kHz" TEXT,
    "Patch_Vibrasyon_hizi" TEXT,
    "Patch_Hava_Basinci" TEXT,
    "Patch_Toz_yukleme_Hizi" TEXT,
    "Teach_Ayari" TEXT,
    "Delay_Ayari" TEXT,
    "Purge_Ayari" TEXT,
    "Testere_secimi" TEXT,
    "Kesim_Mesafesi" TEXT,
    "Yuva_Boyutu" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "machineId" TEXT NOT NULL,
    "processId" TEXT,

    CONSTRAINT "TechnicalParameter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "barcode" TEXT,
    "invoiceDate" TIMESTAMP(3) NOT NULL,
    "currency" "Currency" DEFAULT 'TL',
    "amount" DOUBLE PRECISION,
    "vat" DOUBLE PRECISION,
    "totalAmount" DOUBLE PRECISION,
    "address" TEXT,
    "description" TEXT,
    "rep_name" TEXT,
    "tax_Office" TEXT,
    "taxNo" TEXT,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'PENDING',
    "customerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "OfferType" TEXT NOT NULL DEFAULT 'Fiyat Teklifi',
    "barcode" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "currency" "Currency" DEFAULT 'TL',
    "amount" DOUBLE PRECISION,
    "vat" DOUBLE PRECISION,
    "totalAmount" DOUBLE PRECISION,
    "address" TEXT,
    "description" TEXT,
    "phoneNumber" TEXT,
    "email" TEXT,
    "creatorTitle" TEXT,
    "rep_name" TEXT,
    "tax_Office" TEXT,
    "taxNo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "status" "OfferStatus" NOT NULL DEFAULT 'PENDING',
    "customerId" TEXT,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfferItem" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "application" TEXT,
    "standard" TEXT,
    "currency" "Currency" DEFAULT 'TL',
    "quantity" INTEGER,
    "price" DOUBLE PRECISION,
    "unitPrice" DOUBLE PRECISION,
    "discountPrice" DOUBLE PRECISION,
    "description" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "offerId" TEXT,

    CONSTRAINT "OfferItem_pkey" PRIMARY KEY ("id")
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
    "name" TEXT NOT NULL,

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
CREATE UNIQUE INDEX "Stock_product_code_key" ON "Stock"("product_code");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_faultId_key" ON "Stock"("faultId");

-- CreateIndex
CREATE UNIQUE INDEX "Fault_faultControlId_key" ON "Fault"("faultControlId");

-- CreateIndex
CREATE UNIQUE INDEX "FaultControl_faultId_key" ON "FaultControl"("faultId");

-- CreateIndex
CREATE UNIQUE INDEX "Process_faultId_key" ON "Process"("faultId");

-- CreateIndex
CREATE UNIQUE INDEX "FinalControl_faultId_key" ON "FinalControl"("faultId");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactInfo" ADD CONSTRAINT "ContactInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_faultId_fkey" FOREIGN KEY ("faultId") REFERENCES "Fault"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fault" ADD CONSTRAINT "Fault_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FaultControl" ADD CONSTRAINT "FaultControl_faultId_fkey" FOREIGN KEY ("faultId") REFERENCES "Fault"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Process" ADD CONSTRAINT "Process_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalControl" ADD CONSTRAINT "FinalControl_processId_fkey" FOREIGN KEY ("processId") REFERENCES "Process"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachineParams" ADD CONSTRAINT "MachineParams_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicalParameter" ADD CONSTRAINT "TechnicalParameter_processId_fkey" FOREIGN KEY ("processId") REFERENCES "Process"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferItem" ADD CONSTRAINT "OfferItem_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
