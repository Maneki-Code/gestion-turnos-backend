/*
  Warnings:

  - You are about to drop the column `restEndTime` on the `schedule_day_rests_config` table. All the data in the column will be lost.
  - You are about to drop the column `restStartTime` on the `schedule_day_rests_config` table. All the data in the column will be lost.
  - Added the required column `endTime` to the `schedule_day_rests_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `schedule_day_rests_config` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `schedule_day_rests_config` DROP COLUMN `restEndTime`,
    DROP COLUMN `restStartTime`,
    ADD COLUMN `endTime` VARCHAR(191) NOT NULL,
    ADD COLUMN `startTime` VARCHAR(191) NOT NULL;
