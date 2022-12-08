/*
  Warnings:

  - You are about to drop the column `latitude` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Notification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Notification` DROP COLUMN `latitude`,
    DROP COLUMN `longitude`;
