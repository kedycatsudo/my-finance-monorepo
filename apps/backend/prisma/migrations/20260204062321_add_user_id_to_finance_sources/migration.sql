/*
  Warnings:

  - Added the required column `user_id` to the `finance_sources` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "finance_sources" ADD COLUMN     "user_id" UUID NOT NULL;
