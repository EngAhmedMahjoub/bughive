/*
  Warnings:

  - You are about to drop the column `accessTokenExpires` on the `Account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Account` DROP COLUMN `accessTokenExpires`,
    ADD COLUMN `expires_at` INTEGER NULL,
    ADD COLUMN `id_token` TEXT NULL,
    ADD COLUMN `scope` VARCHAR(191) NULL,
    ADD COLUMN `session_state` VARCHAR(191) NULL,
    ADD COLUMN `token_type` VARCHAR(191) NULL,
    MODIFY `refreshToken` TEXT NULL,
    MODIFY `accessToken` TEXT NULL;

-- AlterTable
ALTER TABLE `Session` MODIFY `accessToken` VARCHAR(191) NULL;
