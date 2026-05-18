-- AlterTable: add column with a temporary default so existing rows are backfilled
ALTER TABLE `Comment` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- Backfill existing rows so updatedAt matches createdAt
UPDATE `Comment` SET `updatedAt` = `createdAt`;

-- Drop the temporary default; Prisma's @updatedAt is managed by the client
ALTER TABLE `Comment` ALTER COLUMN `updatedAt` DROP DEFAULT;
