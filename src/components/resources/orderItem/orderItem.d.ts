import { Product } from "../product/product";
import { Order } from "../order/order";

export type OrderItem = {
  id?: string;
  amount?: number;
  totalPrice?: number;

  product?: Product;
  order?: Order;
};
