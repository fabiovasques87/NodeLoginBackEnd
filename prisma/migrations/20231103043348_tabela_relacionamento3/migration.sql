/*
  Warnings:

  - You are about to drop the `Funcao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UsuarioFuncao` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UsuarioFuncao" DROP CONSTRAINT "_UsuarioFuncao_A_fkey";

-- DropForeignKey
ALTER TABLE "_UsuarioFuncao" DROP CONSTRAINT "_UsuarioFuncao_B_fkey";

-- DropTable
DROP TABLE "Funcao";

-- DropTable
DROP TABLE "Usuario";

-- DropTable
DROP TABLE "_UsuarioFuncao";
