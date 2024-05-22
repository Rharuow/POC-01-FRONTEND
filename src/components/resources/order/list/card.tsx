import React from "react";

import { Card, CardHeader } from "@/components/ui/card";
import { Order } from "../order";
import DeleteOrder from "../delete";
import UpdateOrder from "../update";

export const CardOrder = ({ order }: { order: Order }) => {

  const totalProducts = order.orderItems?.reduce((accumulator, order) => accumulator += order?.amount || 0, 0)

  return (
    <Card className="h-full relative">
      <CardHeader className="flex justify-between">
        <h1>id: <strong>{order.id}</strong></h1>
        <p>Cliente: {order.client?.name}</p>
        <ul>
          <li>Endereço de entrega: <strong>{order.client?.address?.delivery}</strong></li>
          <li>Endereço de cobrança: <strong>{order.client?.address?.billing}</strong></li>
        </ul>
        <p>Items ({totalProducts})</p>
        {order.orderItems?.map(orderItem => (
          <ul>
            <li>Produto: <strong>{orderItem.product?.name}</strong></li>
            <li>Valor unitário: <strong>{orderItem.product?.price}</strong></li>
            <li>Quantidade: <strong>{orderItem.amount}</strong></li>
            <li>Valor total: <strong>{orderItem.totalPrice}</strong></li>
          </ul>
        ))}
        <p>Total da venda: {order.totalPrice}</p>
      </CardHeader>
      <div className="absolute top-1 right-1 flex gap-1">
        <DeleteOrder order={order} />
        <UpdateOrder id={String(order.id)} />
      </div>
    </Card>
  );
};
