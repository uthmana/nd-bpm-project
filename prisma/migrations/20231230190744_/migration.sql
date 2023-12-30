-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'SUPER', 'NORMAL', 'TECH');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'PASSIVE');

-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('SENT', 'PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('TL', 'USD');

-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('ALICI_SATICI', 'ALICI', 'SATICI');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'NORMAL',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
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
    "CustomerName" TEXT NOT NULL,
    "TraceabilityCode" TEXT NOT NULL,
    "ArrivalDate" TIMESTAMP(3) NOT NULL,
    "Product" TEXT NOT NULL,
    "Quantity" INTEGER NOT NULL,
    "ProductCode" TEXT NOT NULL,
    "ProductBatchNumber" TEXT NOT NULL,
    "Application" TEXT,
    "Standard" TEXT,
    "Color" TEXT,
    "FaultDescription" TEXT NOT NULL,
    "SuperUserID" TEXT NOT NULL,
    "SuperUserConfirmation" BOOLEAN NOT NULL,
    "ConfirmationEvidence" TEXT,
    "TechnicalDrawingAttachment" TEXT,
    "InvoiceDate" TIMESTAMP(3),
    "CoatingControl" BOOLEAN,
    "MixedMaterial" BOOLEAN,
    "MachineUserID" TEXT NOT NULL,
    "MachineID" TEXT NOT NULL,
    "ServiceParameters" TEXT NOT NULL,
    "ServiceCompletion" BOOLEAN NOT NULL,
    "Timestamp" TIMESTAMP(3) NOT NULL,
    "CleaningRequired" BOOLEAN NOT NULL DEFAULT false,
    "ProcessControlFrequency" TEXT NOT NULL,

    CONSTRAINT "Fault_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Machine" (
    "id" TEXT NOT NULL,
    "MachineName" TEXT NOT NULL,

    CONSTRAINT "Machine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicalParameter" (
    "id" TEXT NOT NULL,
    "MachineID" TEXT NOT NULL,
    "ParameterName" TEXT NOT NULL,
    "ParameterValue" TEXT NOT NULL,

    CONSTRAINT "TechnicalParameter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerFault" (
    "CustomerID" TEXT NOT NULL,
    "FaultID" TEXT NOT NULL,

    CONSTRAINT "CustomerFault_pkey" PRIMARY KEY ("CustomerID","FaultID")
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
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactInfo" ADD CONSTRAINT "ContactInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
