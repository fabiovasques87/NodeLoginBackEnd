/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Funcao" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Funcao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FuncaoToUsuario" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FuncaoToUsuario_AB_unique" ON "_FuncaoToUsuario"("A", "B");

-- CreateIndex
CREATE INDEX "_FuncaoToUsuario_B_index" ON "_FuncaoToUsuario"("B");

-- AddForeignKey
ALTER TABLE "_FuncaoToUsuario" ADD CONSTRAINT "_FuncaoToUsuario_A_fkey" FOREIGN KEY ("A") REFERENCES "Funcao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FuncaoToUsuario" ADD CONSTRAINT "_FuncaoToUsuario_B_fkey" FOREIGN KEY ("B") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
