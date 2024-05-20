import { z } from "zod";

export const formClientSchema = z
  .object({
    name: z.string().min(4, { message: "Pelo menos 4 caracteres" }),
    cpf: z.string(),
    cnpj: z.string(),
    email: z
      .string({ required_error: "O email é obrigatório" })
      .email("Este é um email inválido."),
    billing: z.string().min(1, { message: "Endereço de cobrança inválido" }),
    delivery: z.string().min(1, { message: "Endereço de entrega inválido" }),
  })
  .partial({
    cnpj: true,
    cpf: true,
  })
  .refine((data) => !!data.cpf || !!data.cnpj, "Documento é obrigatório");
