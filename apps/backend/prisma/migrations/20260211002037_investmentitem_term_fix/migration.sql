/*
  Warnings:

  - The `term` column on the `investment_items` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `user_id` to the `investment_items` table without a default value. This is not possible if the table is not empty.
  - Made the column `asset_name` on table `investment_items` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "investment_items" ADD COLUMN     "user_id" UUID NOT NULL,
ALTER COLUMN "asset_name" SET NOT NULL,
DROP COLUMN "term",
ADD COLUMN     "term" TEXT;
