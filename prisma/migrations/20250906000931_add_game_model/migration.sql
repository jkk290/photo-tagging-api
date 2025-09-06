-- CreateTable
CREATE TABLE "public"."Game" (
    "gameId" TEXT NOT NULL,
    "gameStart" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("gameId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_gameId_key" ON "public"."Game"("gameId");
