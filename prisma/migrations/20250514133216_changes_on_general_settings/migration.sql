/*
  Warnings:

  - You are about to drop the column `minAdvanceHours` on the `generalsettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `generalsettings` DROP COLUMN `minAdvanceHours`,
    ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `phoneNumber` VARCHAR(191) NULL;
