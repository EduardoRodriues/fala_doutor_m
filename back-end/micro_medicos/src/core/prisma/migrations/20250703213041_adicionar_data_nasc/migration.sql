/*
  Warnings:

  - Added the required column `dataNasc` to the `Medico` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Medico" ADD COLUMN     "dataNasc" TIMESTAMP(3) NOT NULL;
