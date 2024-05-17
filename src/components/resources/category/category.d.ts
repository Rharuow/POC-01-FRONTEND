import { Product } from "../product/product";

export type Category = {
  id?: string;
  name?: string;

  products?: Array<Product>
}