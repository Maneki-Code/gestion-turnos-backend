/*
  Warnings:

  - The values [Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday] on the enum `schedule_days_day` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `schedule_days` MODIFY `day` ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL;
