/*
  Warnings:

  - Added the required column `transcodeURL` to the `VideoData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VideoData" ADD COLUMN     "transcodeURL" TEXT NOT NULL;
