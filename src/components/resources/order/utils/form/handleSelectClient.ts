import {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFormSetValue,
} from "react-hook-form";
import { IFormOrder } from "../../order";
import { Product } from "@/components/resources/product/product";

export function handleSelectClient({
  fields,
  product,
  setValue,
  append,
}: {
  fields: Array<FieldArrayWithId<IFormOrder, "orderItems", "id">>;
  append: UseFieldArrayAppend<IFormOrder, "orderItems">;
  setValue: UseFormSetValue<IFormOrder>;
  product: Product;
}) {
  fields.length === 0 &&
    append({
      amount: "1",
      productId: String(product.id),
      totalPrice: String(product.price),
    });
  setValue("totalPrice", String(product.price));
}
