/*
  Warnings:

  - Made the column `user_id` on table `finance_payments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "finance_payments" ALTER COLUMN "user_id" SET NOT NULL;
