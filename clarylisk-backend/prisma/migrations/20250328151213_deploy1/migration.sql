/*
  Warnings:

  - A unique constraint covering the columns `[idUser]` on the table `mediaSocial` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idUser]` on the table `photo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idUser]` on the table `wallet` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "mediaSocial_idUser_key" ON "mediaSocial"("idUser");

-- CreateIndex
CREATE UNIQUE INDEX "photo_idUser_key" ON "photo"("idUser");

-- CreateIndex
CREATE UNIQUE INDEX "wallet_idUser_key" ON "wallet"("idUser");
