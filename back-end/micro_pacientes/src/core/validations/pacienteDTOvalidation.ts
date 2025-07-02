import z from "zod";

export const pacienteSchema = z.object({
  nome: z.string().min(3).max(50),
  cpf: z.string().length(11),
  dataNasc: z.preprocess((val) => {
    if (typeof val === "string" || val instanceof Date) return new Date(val);
  }, z.date()),
});
