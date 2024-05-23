import { Client } from "../client/client";
import { OrderItem } from "../orderItem/orderItem";

export type Order = {
  id?: string;
  totalPrice?: number;

  orderItems?: Array<OrderItem>;
  client?: Client;
};

export type IFormOrder = {
  clientId: string;
  orderItems: Array<{
    productId: string;
    amount: number | string;
    totalPrice: number | string;
  }>;
  totalPrice: number | string;
};
