import { z } from "zod";

export const medicoDTOvalidation = z.object({
  nome: z.string().min(3).max(100).nullable(),

  cpf: z
    .string()
    .regex(/^\d{11}$/, "CPF deve conter exatamente 11 dígitos numéricos")
    .nullable(),

  crm: z
    .string()
    .regex(/^\d{4,6}$/, "CRM deve conter de 4 a 6 números")
    .nullable(),
});

export type MedicoValidatedDTO = z.infer<typeof medicoDTOvalidation>;
