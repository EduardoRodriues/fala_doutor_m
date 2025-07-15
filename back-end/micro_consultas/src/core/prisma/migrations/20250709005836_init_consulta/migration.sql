-- CreateTable
CREATE TABLE "Consulta" (
    "id" BIGSERIAL NOT NULL,
    "medicoId" BIGINT NOT NULL,
    "pacienteId" BIGINT NOT NULL,
    "dataConsulta" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Consulta_pkey" PRIMARY KEY ("id")
);
