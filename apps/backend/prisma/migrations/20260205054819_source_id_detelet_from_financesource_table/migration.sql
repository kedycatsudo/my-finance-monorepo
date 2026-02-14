/*
  Warnings:

  - You are about to drop the column `source_id` on the `finance_sources` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "finance_sources" DROP CONSTRAINT "finance_sources_source_id_fkey";

-- AlterTable
ALTER TABLE "finance_sources" DROP COLUMN "source_id";
