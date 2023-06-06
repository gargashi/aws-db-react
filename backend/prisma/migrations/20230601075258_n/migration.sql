/*
  Warnings:

  - Made the column `urlPath` on table `posts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `posts` MODIFY `urlPath` VARCHAR(191) NOT NULL;
