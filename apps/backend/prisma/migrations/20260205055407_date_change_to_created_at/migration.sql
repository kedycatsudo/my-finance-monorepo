/*
  Warnings:

  - You are about to drop the column `date` on the `finance_payments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "finance_payments" DROP COLUMN "date",
ADD COLUMN     "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP;
