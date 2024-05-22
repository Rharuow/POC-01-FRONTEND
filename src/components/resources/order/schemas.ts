import { z } from "zod";

export const formOrderSchema = z.object({
  clientId: z.string({
    required_error: "Selecione algum cliente",
  }),
  orderItems: z
    .array(
      z.object({
        productId: z.string(),
        amount: z.preprocess(
          (a) => parseInt(z.string().parse(a), 10),
          z.number()
        ),
        totalPrice: z.preprocess(
          (a) => parseFloat(z.string().parse(a)),
          z.number()
        ),
      })
    )
    .nonempty(),
  totalPrice: z.preprocess((a) => parseFloat(z.string().parse(a)), z.number()),
});
