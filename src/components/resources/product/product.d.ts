import { Category } from "../category/category";
import { Order } from "../order/order";

export type Product = {
  id?: string;
  name?: string;
  price?: number;
  description?: string;
  inventory_quantity: number;

  categories?: Array<{ category: Category }>;
  orders?: Array<Order>;
};

export type IFormCreateProduct = {
  name: string;
  description: string;
  price: number;
  inventory_quantity: number;
  categories: Array<{ name: string }>;
};

export type ProcutCreateInput = {
  name: string;
  description: string;
  price: number;
  inventory_quantity: number;
  categories: Array<string>;
};
