import { FieldArrayMethodProps } from "react-hook-form";

export function handleAppend(
  append: (
    value:
      | {
        productId: string;
        amount: string | number;
        totalPrice: string | number;
      }
      | {
        productId: string;
        amount: string | number;
        totalPrice: string | number;
      }[],
    options?: FieldArrayMethodProps | undefined
  ) => void,
  {
    amount,
    productId,
    totalPrice
  }: {
    amount: number | string,
    productId: string,
    totalPrice: number | string
  }
) {
  append({
    amount: String(amount),
    productId: String(productId),
    totalPrice: String(totalPrice),
  });
}

