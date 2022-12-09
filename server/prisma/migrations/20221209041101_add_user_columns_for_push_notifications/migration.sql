-- AlterTable
ALTER TABLE `User` ADD COLUMN `pushNotificationAllowed` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `pushToken` VARCHAR(191) NULL;
