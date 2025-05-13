/*
  Warnings:

  - Added the required column `monthly_installment_amount` to the `fundings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "fundings" ADD COLUMN     "monthly_installment_amount" DOUBLE PRECISION NOT NULL;
