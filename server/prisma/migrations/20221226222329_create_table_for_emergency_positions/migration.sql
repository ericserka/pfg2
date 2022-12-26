/*
  Warnings:

  - You are about to drop the column `latitude` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Notification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Notification` DROP COLUMN `latitude`,
    DROP COLUMN `longitude`;

-- CreateTable
CREATE TABLE `EmergencyLocations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
