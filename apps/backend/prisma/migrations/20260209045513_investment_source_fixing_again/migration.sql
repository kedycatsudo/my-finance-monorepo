-- DropForeignKey
ALTER TABLE "investment_sources" DROP CONSTRAINT "investment_sources_source_id_fkey";

-- AlterTable
ALTER TABLE "investment_sources" ADD COLUMN     "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT;
