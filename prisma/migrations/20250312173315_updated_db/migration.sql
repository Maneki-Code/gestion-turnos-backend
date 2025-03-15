/*
  Warnings:

  - You are about to drop the column `day` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `hour` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `scheduleId` on the `appointments` table. All the data in the column will be lost.
  - The values [reserved,waiting,finished,absent] on the enum `appointments_status` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `scheduleDayId` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slotInterval` to the `schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `schedules` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `appointments` DROP FOREIGN KEY `appointments_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `appointments` DROP FOREIGN KEY `appointments_scheduleId_fkey`;

-- DropIndex
DROP INDEX `appointments_customerId_fkey` ON `appointments`;

-- DropIndex
DROP INDEX `appointments_scheduleId_fkey` ON `appointments`;

-- AlterTable
ALTER TABLE `appointments` DROP COLUMN `day`,
    DROP COLUMN `hour`,
    DROP COLUMN `scheduleId`,
    ADD COLUMN `scheduleDayId` INTEGER NOT NULL,
    ADD COLUMN `startTime` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('AVAILABLE', 'RESERVED', 'WAITING', 'FINISHED', 'ABSENT') NOT NULL,
    MODIFY `customerId` INTEGER NULL;

-- AlterTable
ALTER TABLE `schedules` ADD COLUMN `endDate` DATETIME(3) NOT NULL,
    ADD COLUMN `endTime` VARCHAR(191) NOT NULL,
    ADD COLUMN `slotInterval` INTEGER NOT NULL,
    ADD COLUMN `startDate` DATETIME(3) NOT NULL,
    ADD COLUMN `startTime` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `schedule_days` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `scheduleId` INTEGER NOT NULL,
    `day` ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `schedule_days` ADD CONSTRAINT `schedule_days_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `schedules`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_scheduleDayId_fkey` FOREIGN KEY (`scheduleDayId`) REFERENCES `schedule_days`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
