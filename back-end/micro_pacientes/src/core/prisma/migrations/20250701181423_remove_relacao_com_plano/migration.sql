/*
  Warnings:

  - You are about to drop the `Plano` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Paciente" DROP CONSTRAINT "Paciente_planoId_fkey";

-- DropTable
DROP TABLE "Plano";
