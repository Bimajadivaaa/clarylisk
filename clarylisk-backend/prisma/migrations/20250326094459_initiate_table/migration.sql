-- CreateTable
CREATE TABLE "user" (
    "idUser" SERIAL NOT NULL,
    "password" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,

    CONSTRAINT "user_pkey" PRIMARY KEY ("idUser")
);

-- CreateTable
CREATE TABLE "photo" (
    "idImage" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "idUser" INTEGER NOT NULL,

    CONSTRAINT "photo_pkey" PRIMARY KEY ("idImage")
);

-- CreateTable
CREATE TABLE "wallet" (
    "idWallet" SERIAL NOT NULL,
    "walletAdress" TEXT NOT NULL,
    "idUser" INTEGER NOT NULL,

    CONSTRAINT "wallet_pkey" PRIMARY KEY ("idWallet")
);

-- CreateTable
CREATE TABLE "mediaSocial" (
    "idMedsos" SERIAL NOT NULL,
    "facebook" TEXT,
    "twitter" TEXT,
    "instagram" TEXT,
    "youtube" TEXT,
    "idUser" INTEGER NOT NULL,

    CONSTRAINT "mediaSocial_pkey" PRIMARY KEY ("idMedsos")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_idUser_key" ON "user"("idUser");

-- CreateIndex
CREATE UNIQUE INDEX "photo_idImage_key" ON "photo"("idImage");

-- CreateIndex
CREATE UNIQUE INDEX "wallet_idWallet_key" ON "wallet"("idWallet");

-- CreateIndex
CREATE UNIQUE INDEX "mediaSocial_idMedsos_key" ON "mediaSocial"("idMedsos");

-- AddForeignKey
ALTER TABLE "photo" ADD CONSTRAINT "photo_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "user"("idUser") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet" ADD CONSTRAINT "wallet_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "user"("idUser") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mediaSocial" ADD CONSTRAINT "mediaSocial_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "user"("idUser") ON DELETE CASCADE ON UPDATE CASCADE;
