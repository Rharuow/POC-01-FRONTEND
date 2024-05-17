import { Product } from "../product/product";
import { Sale } from "../sale/sale";

export type Order = {
  id?: string;
  amount?: number;
  totalPrice?: number;

  product?: Product;
  sale?: Sale;
}