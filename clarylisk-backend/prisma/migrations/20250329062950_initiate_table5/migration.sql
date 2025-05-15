/*
  Warnings:

  - A unique constraint covering the columns `[walletAdress]` on the table `wallet` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "wallet_walletAdress_key" ON "wallet"("walletAdress");
