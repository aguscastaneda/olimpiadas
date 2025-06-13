/*
  Warnings:

  - You are about to drop the column `validEmail` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `chatId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `Chat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChatMessage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_chatId_fkey`;

-- AlterTable
ALTER TABLE `Client` DROP COLUMN `validEmail`;

-- AlterTable
ALTER TABLE `Comment` ADD COLUMN `view` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Order` DROP COLUMN `chatId`;

-- AlterTable
ALTER TABLE `Response` ADD COLUMN `view` BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE `Chat`;

-- DropTable
DROP TABLE `ChatMessage`;

-- CreateTable
CREATE TABLE `OrderMessage` (
    `idOrderMessage` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `vendedor` BOOLEAN NOT NULL,
    `view` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`idOrderMessage`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OrderMessage` ADD CONSTRAINT `OrderMessage_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
