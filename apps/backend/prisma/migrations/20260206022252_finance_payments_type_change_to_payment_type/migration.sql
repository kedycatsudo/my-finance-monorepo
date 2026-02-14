/*
  Warnings:

  - You are about to drop the column `type` on the `finance_payments` table. All the data in the column will be lost.
  - Added the required column `payment_type` to the `finance_payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "finance_payments" DROP COLUMN "type",
ADD COLUMN     "payment_type" "payment_type" NOT NULL;
