-- AlterTable
ALTER TABLE `Notification` MODIFY `type` ENUM('INVITE', 'HELP', 'MESSAGE', 'GROUP_REMOVED') NOT NULL;