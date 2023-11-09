/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FuncaoToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_FuncaoToUser" DROP CONSTRAINT "_FuncaoToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_FuncaoToUser" DROP CONSTRAINT "_FuncaoToUser_B_fkey";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "_FuncaoToUser";

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UsuarioFuncao" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_username_key" ON "Usuario"("username");

-- CreateIndex
CREATE UNIQUE INDEX "_UsuarioFuncao_AB_unique" ON "_UsuarioFuncao"("A", "B");

-- CreateIndex
CREATE INDEX "_UsuarioFuncao_B_index" ON "_UsuarioFuncao"("B");

-- AddForeignKey
ALTER TABLE "_UsuarioFuncao" ADD CONSTRAINT "_UsuarioFuncao_A_fkey" FOREIGN KEY ("A") REFERENCES "Funcao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsuarioFuncao" ADD CONSTRAINT "_UsuarioFuncao_B_fkey" FOREIGN KEY ("B") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
