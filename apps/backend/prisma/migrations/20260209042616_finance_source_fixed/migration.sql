/*
  Warnings:

  - Added the required column `user_id` to the `investment_sources` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "investment_sources" ADD COLUMN     "user_id" UUID NOT NULL;
