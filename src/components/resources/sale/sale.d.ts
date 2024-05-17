import { Client } from "../client/client";
import { Order } from "../order/order";

export type Sale = {
  id?: string;
  totalPrice?: number;

  orders?: Array<Order>
  client?: Client
}