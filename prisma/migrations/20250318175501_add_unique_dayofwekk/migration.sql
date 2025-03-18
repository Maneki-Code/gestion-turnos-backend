/*
  Warnings:

  - You are about to drop the `schedule_day_rests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `schedule_days` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `schedule_day_rests` DROP FOREIGN KEY `schedule_day_rests_scheduleDayId_fkey`;

-- DropForeignKey
ALTER TABLE `schedule_days` DROP FOREIGN KEY `schedule_days_scheduleId_fkey`;

-- DropTable
DROP TABLE `schedule_day_rests`;

-- DropTable
DROP TABLE `schedule_days`;

-- CreateTable
CREATE TABLE `schedule_days_config` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `scheduleId` INTEGER NOT NULL,
    `day` ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL,
    `startTime` VARCHAR(191) NOT NULL,
    `endTime` VARCHAR(191) NOT NULL,
    `slotInterval` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `schedule_days_config_day_key`(`day`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `schedule_day_rests_config` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `scheduleDayId` INTEGER NOT NULL,
    `restStartTime` VARCHAR(191) NOT NULL,
    `restEndTime` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `schedule_days_config` ADD CONSTRAINT `schedule_days_config_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `schedules`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedule_day_rests_config` ADD CONSTRAINT `schedule_day_rests_config_scheduleDayId_fkey` FOREIGN KEY (`scheduleDayId`) REFERENCES `schedule_days_config`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
