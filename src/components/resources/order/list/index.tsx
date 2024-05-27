import React from "react";

import { Order } from "../order";
import { CreateOrder } from "../create";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/currencyConverter";
import { cn } from "@/lib/utils";
import DeleteOrder from "../delete";
import UpdateOrder from "../update";
import { Separator } from "@/components/ui/separator";


export const ListOrder = ({ orders }: { orders: Array<Order> }) => {

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Cliente</TableHead>
          <TableHead className="text-center">Produtos</TableHead>
          <TableHead className="text-center">Valores unitários</TableHead>
          <TableHead className="text-center">Quantidades</TableHead>
          <TableHead className="text-center">Valores totais</TableHead>
          <TableHead className="text-center">Total da venda</TableHead>
          <TableHead className="text-center"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell><p className="text-center">{order.client?.name}</p></TableCell>
            <TableCell>
              <div className="flex flex-col gap-2">
                {order.orderItems?.map((orderItem, index, self) => (
                  <div className="flex flex-col gap-2" key={orderItem.id}>
                    <p className={cn("flex flex-col items-center gap-1 px-1 rounded bg-gray-700", { "bg-gray-500": index % 2 === 0 })}>
                      {orderItem.product?.name}
                    </p>
                    {self.length > 1 && index < self.length - 1 && <Separator className="h-[1px] bg-transparent border-b border-dotted" />}
                  </div>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-2">
                {order.orderItems?.map((orderItem, index, self) => (
                  <div className="flex flex-col gap-2" key={orderItem.id}>
                    <p className={cn("flex flex-col items-center gap-1 px-1 rounded bg-gray-700", { "bg-gray-500": index % 2 === 0 })}>
                      {formatCurrency(Number(orderItem.totalPrice) / Number(orderItem.amount))}
                    </p>
                    {self.length > 1 && index < self.length - 1 && <Separator className="h-[1px] bg-transparent border-b border-dotted" />}
                  </div>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-2">
                {order.orderItems?.map((orderItem, index, self) => (
                  <div className="flex flex-col gap-2" key={orderItem.id} >
                    <p className={cn("flex flex-col items-center gap-1 px-1 rounded bg-gray-700", { "bg-gray-500": index % 2 === 0 })}>
                      {orderItem.amount}
                    </p>
                    {self.length > 1 && index < self.length - 1 && <Separator className="h-[1px] bg-transparent border-b border-dotted" />}
                  </div>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-2">
                {order.orderItems?.map((orderItem, index, self) => (
                  <div className="flex flex-col gap-2" key={orderItem.id}>
                    <p className={cn("flex flex-col items-center gap-1 px-1 rounded bg-gray-700", { "bg-gray-500": index % 2 === 0 })}>
                      {formatCurrency(Number(orderItem.totalPrice))}
                    </p>
                    {self.length > 1 && index < self.length - 1 && <Separator className="h-[1px] bg-transparent border-b border-dotted" />}
                  </div>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <p className="text-center">{formatCurrency(Number(order.totalPrice))}</p>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <DeleteOrder order={order} />
                <UpdateOrder id={String(order.id)} />
              </div>
            </TableCell>
          </TableRow>
        ))}
        <TableRow>
          <TableCell colSpan={7}>
            <CreateOrder orders={orders} />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
