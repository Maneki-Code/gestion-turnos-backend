/*
  Warnings:

  - You are about to drop the `scheduledayrest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `scheduledayrest` DROP FOREIGN KEY `ScheduleDayRest_scheduleDayId_fkey`;

-- DropTable
DROP TABLE `scheduledayrest`;

-- CreateTable
CREATE TABLE `schedule_day_rests` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `scheduleDayId` INTEGER NOT NULL,
    `restStartTime` VARCHAR(191) NOT NULL,
    `restEndTime` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `schedule_day_rests` ADD CONSTRAINT `schedule_day_rests_scheduleDayId_fkey` FOREIGN KEY (`scheduleDayId`) REFERENCES `schedule_days`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
