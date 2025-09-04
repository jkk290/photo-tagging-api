-- CreateTable
CREATE TABLE "public"."Character" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "posX" INTEGER NOT NULL,
    "posY" INTEGER NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Record" (
    "id" SERIAL NOT NULL,
    "playerName" TEXT NOT NULL,
    "timer" INTEGER NOT NULL,

    CONSTRAINT "Record_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Character_name_key" ON "public"."Character"("name");
