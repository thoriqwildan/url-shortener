-- DropForeignKey
ALTER TABLE `urls` DROP FOREIGN KEY `urls_user_id_fkey`;

-- DropIndex
DROP INDEX `urls_user_id_fkey` ON `urls`;

-- AlterTable
ALTER TABLE `urls` MODIFY `user_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `urls` ADD CONSTRAINT `urls_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
