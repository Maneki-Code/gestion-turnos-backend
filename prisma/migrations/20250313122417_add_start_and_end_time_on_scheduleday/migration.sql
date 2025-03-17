/*
  Warnings:

  - You are about to drop the column `endTime` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the column `slotInterval` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `schedules` table. All the data in the column will be lost.
  - Added the required column `endTime` to the `schedule_days` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slotInterval` to the `schedule_days` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `schedule_days` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `schedule_days` ADD COLUMN `endTime` VARCHAR(191) NOT NULL,
    ADD COLUMN `slotInterval` INTEGER NOT NULL,
    ADD COLUMN `startTime` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `schedules` DROP COLUMN `endTime`,
    DROP COLUMN `slotInterval`,
    DROP COLUMN `startTime`;
