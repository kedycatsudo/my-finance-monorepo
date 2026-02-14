/*
  Warnings:

  - You are about to drop the column `date` on the `finance_sources` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "finance_sources" DROP COLUMN "date",
ADD COLUMN     "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP;
