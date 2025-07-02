-- CreateTable
CREATE TABLE "MedicoPlano" (
    "medicoId" BIGINT NOT NULL,
    "planoId" BIGINT NOT NULL,

    CONSTRAINT "MedicoPlano_pkey" PRIMARY KEY ("medicoId","planoId")
);

-- AddForeignKey
ALTER TABLE "MedicoPlano" ADD CONSTRAINT "MedicoPlano_medicoId_fkey" FOREIGN KEY ("medicoId") REFERENCES "Medico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
