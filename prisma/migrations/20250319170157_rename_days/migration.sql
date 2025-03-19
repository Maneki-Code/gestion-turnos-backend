/*
  Warnings:

  - The values [AVAILABLE,RESERVED,WAITING,FINISHED,ABSENT] on the enum `appointments_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY,SUNDAY] on the enum `schedule_days_config_day` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `appointments` MODIFY `status` ENUM('DISPONIBLE', 'RESERVADO', 'ESPERANDO', 'TERMINADO', 'AUSENTE') NOT NULL;

-- AlterTable
ALTER TABLE `schedule_days_config` MODIFY `day` ENUM('LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO') NOT NULL;
