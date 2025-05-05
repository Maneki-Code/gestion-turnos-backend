-- DropForeignKey
ALTER TABLE `schedules` DROP FOREIGN KEY `schedules_userId_fkey`;

-- AddForeignKey
ALTER TABLE `schedules` ADD CONSTRAINT `schedules_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
