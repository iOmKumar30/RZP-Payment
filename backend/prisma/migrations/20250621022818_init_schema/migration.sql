/*
  Warnings:

  - You are about to drop the `Counter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Donation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Counter";

-- DropTable
DROP TABLE "Donation";

-- CreateTable
CREATE TABLE "donation" (
    "pan" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "receiptNumber" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "counter" (
    "financialYear" TEXT NOT NULL,
    "seq" INTEGER NOT NULL,

    CONSTRAINT "counter_pkey" PRIMARY KEY ("financialYear")
);

-- CreateIndex
CREATE UNIQUE INDEX "donation_receiptNumber_key" ON "donation"("receiptNumber");

-- CreateIndex
CREATE UNIQUE INDEX "donation_transactionId_key" ON "donation"("transactionId");
