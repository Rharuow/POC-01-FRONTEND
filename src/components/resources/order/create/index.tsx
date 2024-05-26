import React from "react";
import { PlusCircle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormCreateOrder } from "./form";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Order } from "../order";

export const CreateOrder = ({ orders }: { orders: Array<Order> }) => {
  return (
    <Dialog>
      <DialogTrigger
        asChild
      >
        <Card
          className={cn(
            "h-full w-full bg-transparent text-white border-dashed hover:cursor-pointer p-0",
            {
              "min-h-20": orders.length === 0,
            }
          )}
        >
          <CardContent className="flex flex-col gap-4 justify-center items-center p-4">
            <PlusCircle />
            {orders.length === 0 ? (
              <p>Nenhuma venda Cadastrado</p>
            ) : (
              <p>Adicionar venda</p>
            )}
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent
        className="max-w-[425px] md:max-w-[525px] lg:max-w-[825px]"
      >
        <DialogHeader>
          <DialogTitle>Adicionar Venda</DialogTitle>
        </DialogHeader>
        <FormCreateOrder />
      </DialogContent>
    </Dialog>

  );
};
