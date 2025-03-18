-- DropForeignKey
ALTER TABLE `appointments` DROP FOREIGN KEY `appointments_scheduleDayId_fkey`;

-- DropForeignKey
ALTER TABLE `schedule_day_rests` DROP FOREIGN KEY `schedule_day_rests_scheduleDayId_fkey`;

-- DropIndex
DROP INDEX `appointments_scheduleDayId_fkey` ON `appointments`;

-- DropIndex
DROP INDEX `schedule_day_rests_scheduleDayId_fkey` ON `schedule_day_rests`;

-- AddForeignKey
ALTER TABLE `schedule_day_rests` ADD CONSTRAINT `schedule_day_rests_scheduleDayId_fkey` FOREIGN KEY (`scheduleDayId`) REFERENCES `schedule_days`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_scheduleDayId_fkey` FOREIGN KEY (`scheduleDayId`) REFERENCES `schedule_days`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
