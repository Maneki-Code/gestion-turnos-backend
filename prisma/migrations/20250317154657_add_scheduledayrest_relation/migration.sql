/*
  Warnings:

  - You are about to drop the column `restEndTime` on the `schedule_days` table. All the data in the column will be lost.
  - You are about to drop the column `restStartTime` on the `schedule_days` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `schedule_days` DROP COLUMN `restEndTime`,
    DROP COLUMN `restStartTime`;

-- CreateTable
CREATE TABLE `ScheduleDayRest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `scheduleDayId` INTEGER NOT NULL,
    `restStartTime` VARCHAR(191) NOT NULL,
    `restEndTime` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ScheduleDayRest` ADD CONSTRAINT `ScheduleDayRest_scheduleDayId_fkey` FOREIGN KEY (`scheduleDayId`) REFERENCES `schedule_days`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
