/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Chat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ClientProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Discount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Favorite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Last` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Like` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductOrder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Response` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SalesManager` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Client` DROP FOREIGN KEY `Client_chatId_fkey`;

-- DropForeignKey
ALTER TABLE `Client` DROP FOREIGN KEY `Client_profileId_fkey`;

-- DropForeignKey
ALTER TABLE `ClientProduct` DROP FOREIGN KEY `ClientProduct_clientId_fkey`;

-- DropForeignKey
ALTER TABLE `ClientProduct` DROP FOREIGN KEY `ClientProduct_productId_fkey`;

-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_clientId_fkey`;

-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_productId_fkey`;

-- DropForeignKey
ALTER TABLE `Discount` DROP FOREIGN KEY `Discount_productId_fkey`;

-- DropForeignKey
ALTER TABLE `Favorite` DROP FOREIGN KEY `Favorite_clientId_fkey`;

-- DropForeignKey
ALTER TABLE `Favorite` DROP FOREIGN KEY `Favorite_productId_fkey`;

-- DropForeignKey
ALTER TABLE `Last` DROP FOREIGN KEY `Last_productId_fkey`;

-- DropForeignKey
ALTER TABLE `Like` DROP FOREIGN KEY `Like_clientId_fkey`;

-- DropForeignKey
ALTER TABLE `Like` DROP FOREIGN KEY `Like_productId_fkey`;

-- DropForeignKey
ALTER TABLE `Notification` DROP FOREIGN KEY `Notification_clientId_fkey`;

-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_clientId_fkey`;

-- DropForeignKey
ALTER TABLE `Product` DROP FOREIGN KEY `Product_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `ProductOrder` DROP FOREIGN KEY `ProductOrder_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `ProductOrder` DROP FOREIGN KEY `ProductOrder_productId_fkey`;

-- DropForeignKey
ALTER TABLE `Response` DROP FOREIGN KEY `Response_commentId_fkey`;

-- DropForeignKey
ALTER TABLE `SalesManager` DROP FOREIGN KEY `SalesManager_profileId_fkey`;

-- DropTable
DROP TABLE `Category`;

-- DropTable
DROP TABLE `Chat`;

-- DropTable
DROP TABLE `Client`;

-- DropTable
DROP TABLE `ClientProduct`;

-- DropTable
DROP TABLE `Comment`;

-- DropTable
DROP TABLE `Discount`;

-- DropTable
DROP TABLE `Favorite`;

-- DropTable
DROP TABLE `Last`;

-- DropTable
DROP TABLE `Like`;

-- DropTable
DROP TABLE `Notification`;

-- DropTable
DROP TABLE `Order`;

-- DropTable
DROP TABLE `Product`;

-- DropTable
DROP TABLE `ProductOrder`;

-- DropTable
DROP TABLE `Profile`;

-- DropTable
DROP TABLE `Response`;

-- DropTable
DROP TABLE `SalesManager`;
