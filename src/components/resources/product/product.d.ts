import { Category } from "../category/category";
import { Order } from "../orderItem/order";

export type Product = {
  id?: string;
  name?: string;
  price?: number | string;
  description?: string;
  inventory_quantity: number | string;

  categories?: Array<{ categoryName: string }>;
  orders?: Array<Order>;
};

export type IFormProduct = {
  name: string;
  description: string;
  price: number | string;
  inventory_quantity: number | string;
  categories: Array<{ name: string }>;
};

export type ProductInput = {
  name: string;
  description: string;
  price: number;
  inventory_quantity: number | string;
  categories: Array<string>;
};
