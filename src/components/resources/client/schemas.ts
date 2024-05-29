import { z } from "zod";

export const formClientSchema = z
  .object({
    name: z.string().min(4, { message: "Pelo menos 4 caracteres" }),
    cpf: z.string({ message: "CPF é obrigatório" }).optional(),
    cnpj: z.string({ message: "CNPJ é obrigatório" }).optional(),
    email: z
      .string({ required_error: "O email é obrigatório" })
      .email("Este é um email inválido."),
    billing: z.string({
      message: "Endereço de cobrança é obrigatório",
    }),
    delivery: z.string({ message: "Endereço de entrega é obrigatório" }),
    zipCode: z.string().optional(),
    neighborhood: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    number: z.string().optional(),
    street: z.string().optional(),
    complement: z.string().optional(),
  })
  .partial({
    cnpj: true,
    cpf: true,
  })
  .superRefine(({ cnpj, cpf, billing, delivery }, ctx) => {
    if (!cpf && !cnpj) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom, // customize your issue
        message: "CPF é obrigatório",
        path: ["cpf"],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom, // customize your issue
        message: "CNPJ é obrigatório",
        path: ["cnpj"],
      });
    }
    if (!billing) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Endereço de cobrança é obrigatório",
        path: ["billing"],
      });
    }
    if (!delivery) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Endereço de entrega é obrigatório",
        path: ["delivery"],
      });
    }

    return z.NEVER;
  });
