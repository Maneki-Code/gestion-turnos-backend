-- CreateTable
CREATE TABLE `_UserServices` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_UserServices_AB_unique`(`A`, `B`),
    INDEX `_UserServices_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_UserServices` ADD CONSTRAINT `_UserServices_A_fkey` FOREIGN KEY (`A`) REFERENCES `OfferedServices`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserServices` ADD CONSTRAINT `_UserServices_B_fkey` FOREIGN KEY (`B`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
