-- CreateTable
CREATE TABLE "Documento" (
    "id" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "embedding" vector NOT NULL,

    CONSTRAINT "Documento_pkey" PRIMARY KEY ("id")
);
