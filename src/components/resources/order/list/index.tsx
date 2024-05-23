import React, { createContext, useContext, useState } from "react";
import { PlusCircle } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@apollo/client";
import { CardOrder } from "./card";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Order } from "../order";
import { CreateOrder } from "../create";
import { GET_ORDERS } from "@/service/queries/order";
import Loading from "./loading";

const OpenCreateOrderModalContext = createContext<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  isOpen: false,
  setIsOpen: () => { },
});

export const useOpenCreateOrderModalContext = () =>
  useContext(OpenCreateOrderModalContext);

export const ListOrder = () => {
  const { data, loading } = useQuery<{ getOrders: Array<Order> }>(GET_ORDERS);

  const [isOpenCreateOrderModal, setIsOpenCreateOrderModal] = useState(false);

  return (
    <Carousel className="w-full">
      <CarouselContent className="w-full">
        {loading
          ? <Loading />
          : data?.getOrders.map((order, _, self) => (
            <CarouselItem
              className={cn("md:basis-1/2", {
                "lg:basis-1/4": self.length >= 4,
                "lg:basis-1/3": self.length === 3,
                "lg:basis-1/2": self.length <= 2,
              })}
              key={order.id}
            >
              <CardOrder order={order} />
            </CarouselItem>
          ))}
        <CarouselItem
          className={cn({
            "lg:basis-auto flex justify-center grow": data?.getOrders.length === 0,
            "md:basis-1/2 lg:basis-1/4": data?.getOrders && data?.getOrders.length >= 4,
            "md:basis-1/2 lg:basis-1/3": data?.getOrders.length === 3,
            "md:basis-1/2 lg:basis-1/2": data?.getOrders && data?.getOrders.length <= 2,
          })}
          key={data?.getOrders.length}
        >
          <OpenCreateOrderModalContext.Provider
            value={{
              isOpen: isOpenCreateOrderModal,
              setIsOpen: setIsOpenCreateOrderModal,
            }}
          >
            <Dialog open={isOpenCreateOrderModal}>
              <DialogTrigger
                asChild
                onClick={() => setIsOpenCreateOrderModal(true)}
              >
                <Card
                  className={cn(
                    "h-full w-full bg-transparent text-white border-dashed hover:cursor-pointer p-0",
                    {
                      "min-h-20": data?.getOrders.length === 0,
                    }
                  )}
                >
                  <CardContent className="flex flex-col gap-4 justify-center items-center p-4">
                    <PlusCircle />
                    {data?.getOrders.length === 0 ? (
                      <p>Nenhuma venda Cadastrado</p>
                    ) : (
                      <p>Adicionar venda</p>
                    )}
                  </CardContent>
                </Card>
              </DialogTrigger>
              <CreateOrder />
            </Dialog>
          </OpenCreateOrderModalContext.Provider>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
};
