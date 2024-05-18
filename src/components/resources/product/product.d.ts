import { Category } from "../category/category";
import { Order } from "../order/order";

export type Product = {
  id?: string;
  name?: string;
  description?: string;
  inventory_quantity: number;

  categories?: Array<{ category: Category }>;
  orders?: Array<Order>;
};
