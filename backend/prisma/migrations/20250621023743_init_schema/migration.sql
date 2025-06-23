/*
  Warnings:

  - Added the required column `email` to the `donation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `donation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "donation" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL;
