/*
  Warnings:

  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FuncaoToUsuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_FuncaoToUsuario" DROP CONSTRAINT "_FuncaoToUsuario_A_fkey";

-- DropForeignKey
ALTER TABLE "_FuncaoToUsuario" DROP CONSTRAINT "_FuncaoToUsuario_B_fkey";

-- DropTable
DROP TABLE "Usuario";

-- DropTable
DROP TABLE "_FuncaoToUsuario";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FuncaoToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FuncaoToUser_AB_unique" ON "_FuncaoToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_FuncaoToUser_B_index" ON "_FuncaoToUser"("B");

-- AddForeignKey
ALTER TABLE "_FuncaoToUser" ADD CONSTRAINT "_FuncaoToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Funcao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FuncaoToUser" ADD CONSTRAINT "_FuncaoToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
