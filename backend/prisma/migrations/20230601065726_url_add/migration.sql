/*
  Warnings:

  - Added the required column `url` to the `Posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `posts` ADD COLUMN `url` VARCHAR(191) NOT NULL;
