/*
  Warnings:

  - Added the required column `endTime` to the `appointments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `appointments` ADD COLUMN `endTime` VARCHAR(191) NOT NULL;
