/*
  Warnings:

  - The values [DISPONIBLE,ESPERANDO] on the enum `appointments_status` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[scheduleId,day]` on the table `schedule_days_config` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `schedule_days_config_day_key` ON `schedule_days_config`;

-- AlterTable
ALTER TABLE `appointments` MODIFY `status` ENUM('RESERVADO', 'TERMINADO', 'AUSENTE') NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `schedule_days_config_scheduleId_day_key` ON `schedule_days_config`(`scheduleId`, `day`);
