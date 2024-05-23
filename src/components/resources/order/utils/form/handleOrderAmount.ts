import { Product } from "@/components/resources/product/product";
import { UseFormSetValue } from "react-hook-form";
import { IFormOrder } from "../../order";

export function handleOrderAmount({
  amount,
  index,
  productId,
  setValue,
  products,
}: {
  amount: number | string;
  index: number;
  productId: string;
  setValue: UseFormSetValue<IFormOrder>;
  products: Array<Product>;
}) {
  setValue(
    `orderItems.${index}.totalPrice`,
    String(
      parseFloat(
        (
          Number(products.find((product) => product.id === productId)?.price) *
          Number(amount)
        ).toFixed(2)
      )
    )
  );
}
