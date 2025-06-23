/*
  Warnings:

  - You are about to drop the column `phone` on the `donation` table. All the data in the column will be lost.
  - Added the required column `contact` to the `donation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "donation" DROP COLUMN "phone",
ADD COLUMN     "contact" TEXT NOT NULL;
