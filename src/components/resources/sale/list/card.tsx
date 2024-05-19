import React from "react";

import { Card, CardHeader } from "@/components/ui/card";
// import DeleteSale from "../delete";
// import UpdateSale from "../update";
import { Sale } from "../sale";
import DeleteSale from "../delete";

export const CardSale = ({ sale }: { sale: Sale }) => {

  const totalProducts = sale.orders?.reduce((accumulator, order) => accumulator += order?.amount || 0, 0)

  return (
    <Card className="h-full relative">
      <CardHeader className="flex justify-between">
        <h1>id: <strong>{sale.id}</strong></h1>
        <p>Cliente: {sale.client?.name}</p>
        <ul>
          <li>Endereço de entrega: <strong>{sale.client?.address?.delivery}</strong></li>
          <li>Endereço de cobrança: <strong>{sale.client?.address?.billing}</strong></li>
        </ul>
        <p>Items ({totalProducts})</p>
        {sale.orders?.map(order => (
          <ul>
            <li>Produto: <strong>{order.product?.name}</strong></li>
            <li>Valor unitário: <strong>{order.product?.price}</strong></li>
            <li>Quantidade: <strong>{order.amount}</strong></li>
            <li>Valor total: <strong>{order.totalPrice}</strong></li>
          </ul>
        ))}
        <p>Total da venda: {sale.totalPrice}</p>
      </CardHeader>
      <div className="absolute top-1 right-1 flex gap-1">
        <DeleteSale sale={sale} />
        {/*<UpdateSale id={String(sale.id)} /> */}
      </div>
    </Card>
  );
};
