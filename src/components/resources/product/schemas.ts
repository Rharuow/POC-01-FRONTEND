import { z } from "zod";

export const formProdcutSchema = z.object({
  name: z.string().min(4, { message: "Pelo menos 4 caracteres" }),
  description: z.string().min(10, { message: "Pelo menos 10 caracteres" }),
  price: z.preprocess((a) => parseFloat(z.string().parse(a)), z.number()),
  inventory_quantity: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number()
  ),
  categories: z
    .array(
      z.object({
        name: z.string(),
      })
    )
    .nullable(),
});
