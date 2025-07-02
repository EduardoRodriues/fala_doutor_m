import z from "zod";

export const planoSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  preco: z
    .union([z.string(), z.number()])
    .transform((val) => val.toString()),
  descricao: z.string().min(1, "Descrição é obrigatória"),
});

export type PlanoDTO = z.infer<typeof planoSchema>;