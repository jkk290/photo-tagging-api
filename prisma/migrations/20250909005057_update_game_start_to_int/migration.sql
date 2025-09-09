/*
  Warnings:

  - Changed the type of `gameStart` on the `Game` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Game" DROP COLUMN "gameStart",
ADD COLUMN     "gameStart" INTEGER NOT NULL;
