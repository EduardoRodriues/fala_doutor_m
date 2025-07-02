-- AlterTable
CREATE SEQUENCE plano_id_seq;
ALTER TABLE "Plano" ALTER COLUMN "id" SET DEFAULT nextval('plano_id_seq');
ALTER SEQUENCE plano_id_seq OWNED BY "Plano"."id";
