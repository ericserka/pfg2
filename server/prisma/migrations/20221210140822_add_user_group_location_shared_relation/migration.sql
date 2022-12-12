-- CreateTable
CREATE TABLE `_groupLocationShared` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_groupLocationShared_AB_unique`(`A`, `B`),
    INDEX `_groupLocationShared_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_groupLocationShared` ADD CONSTRAINT `_groupLocationShared_A_fkey` FOREIGN KEY (`A`) REFERENCES `Group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_groupLocationShared` ADD CONSTRAINT `_groupLocationShared_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
