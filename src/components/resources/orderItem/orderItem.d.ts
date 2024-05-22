import { Product } from "../product/product";
import { Sale } from "../order/sale";

export type OrderItem = {
  id?: string;
  amount?: number;
  totalPrice?: number;

  product?: Product;
  sale?: Sale;
};
