-- CreateEnum
CREATE TYPE "finance_source_type" AS ENUM ('outcome', 'income');

-- CreateEnum
CREATE TYPE "investment_result" AS ENUM ('profit', 'loss', 'none');

-- CreateEnum
CREATE TYPE "investment_source_type" AS ENUM ('crypto', 'forex', 'investment');

-- CreateEnum
CREATE TYPE "investment_status" AS ENUM ('open', 'closed');

-- CreateEnum
CREATE TYPE "investment_term" AS ENUM ('short', 'middle', 'long');

-- CreateEnum
CREATE TYPE "payment_status" AS ENUM ('paid', 'coming');

-- CreateEnum
CREATE TYPE "payment_type" AS ENUM ('credit card', 'cash');

-- CreateEnum
CREATE TYPE "source_type" AS ENUM ('finance', 'investment');

-- CreateTable
CREATE TABLE "finance_sources" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "source_id" UUID NOT NULL,
    "type" "finance_source_type" NOT NULL,
    "name" VARCHAR(200),

    CONSTRAINT "finance_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_payments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "type" "payment_type" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "date" DATE NOT NULL,
    "loop" BOOLEAN NOT NULL DEFAULT false,
    "status" "payment_status" NOT NULL,
    "financesource_id" UUID NOT NULL,

    CONSTRAINT "finance_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investment_sources" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" "investment_source_type" NOT NULL,
    "name" VARCHAR(200),
    "source_id" UUID NOT NULL,

    CONSTRAINT "investment_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investment_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "investment_source_id" UUID NOT NULL,
    "asset_name" VARCHAR(75),
    "term" "investment_term" NOT NULL,
    "invested_amount" DECIMAL(18,2) NOT NULL,
    "entry_date" DATE NOT NULL,
    "exit_date" DATE,
    "result" "investment_result" NOT NULL,
    "result_amount" DECIMAL(18,2),
    "status" "investment_status" NOT NULL,

    CONSTRAINT "investment_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sources" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "source_name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "date" DATE,
    "type" VARCHAR(24) NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "monthly_circle_date" VARCHAR(10),
    "password" TEXT NOT NULL,
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "finance_sources" ADD CONSTRAINT "finance_sources_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "sources"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "finance_payments" ADD CONSTRAINT "finance_payments_financesource_id_fkey" FOREIGN KEY ("financesource_id") REFERENCES "finance_sources"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investment_sources" ADD CONSTRAINT "investment_sources_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "sources"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investment_items" ADD CONSTRAINT "investment_items_investment_source_id_fkey" FOREIGN KEY ("investment_source_id") REFERENCES "investment_sources"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sources" ADD CONSTRAINT "sources_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
