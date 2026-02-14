/*
  Warnings:

  - The `result` column on the `investment_items` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `investment_items` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "investment_items" DROP COLUMN "result",
ADD COLUMN     "result" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT;
