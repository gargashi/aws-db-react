/*
  Warnings:

  - You are about to drop the column `url` on the `posts` table. All the data in the column will be lost.
  - Added the required column `urlPath` to the `Posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `posts` DROP COLUMN `url`,
    ADD COLUMN `urlPath` VARCHAR(191) NOT NULL;
