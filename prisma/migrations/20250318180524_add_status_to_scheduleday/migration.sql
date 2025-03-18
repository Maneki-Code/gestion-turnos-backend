/*
  Warnings:

  - Added the required column `status` to the `schedule_days_config` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `schedule_days_config` ADD COLUMN `status` BOOLEAN NOT NULL;
