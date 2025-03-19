/*
  Warnings:

  - You are about to drop the column `scheduleDayId` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `schedule_days` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `schedules` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `schedules` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduleId` to the `appointments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `appointments` DROP FOREIGN KEY `appointments_scheduleDayId_fkey`;

-- DropIndex
DROP INDEX `appointments_scheduleDayId_fkey` ON `appointments`;

-- AlterTable
ALTER TABLE `appointments` DROP COLUMN `scheduleDayId`,
    ADD COLUMN `date` DATETIME(3) NOT NULL,
    ADD COLUMN `scheduleId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `schedule_days` DROP COLUMN `date`;

-- AlterTable
ALTER TABLE `schedules` DROP COLUMN `endDate`,
    DROP COLUMN `startDate`;

-- CreateIndex
CREATE UNIQUE INDEX `schedules_userId_key` ON `schedules`(`userId`);

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `schedules`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
