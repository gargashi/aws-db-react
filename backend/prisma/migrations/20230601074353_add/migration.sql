/*
  Warnings:

  - Added the required column `urlPath` to the `Posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `posts` ADD COLUMN `urlPath` VARCHAR(191);
