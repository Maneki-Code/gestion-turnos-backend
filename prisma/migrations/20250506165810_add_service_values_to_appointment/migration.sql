/*
  Warnings:

  - You are about to drop the column `description` on the `appointments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `appointments` DROP COLUMN `description`,
    ADD COLUMN `serviceDescription` VARCHAR(191) NULL,
    ADD COLUMN `servicePrice` DOUBLE NOT NULL DEFAULT 0.0,
    ADD COLUMN `serviceTitle` VARCHAR(191) NOT NULL DEFAULT '';
