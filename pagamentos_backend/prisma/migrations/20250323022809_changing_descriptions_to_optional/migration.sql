-- AlterTable
ALTER TABLE "balances" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "description" DROP NOT NULL;
