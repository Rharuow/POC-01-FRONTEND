import React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useQuery } from "@apollo/client";
import { CardOrder } from "./card";
import { cn } from "@/lib/utils";
import { Order } from "../order";
import { CreateOrder } from "../create";
import { GET_ORDERS } from "@/service/queries/order";
import Loading from "./loading";


export const ListOrder = () => {
  const { data, loading } = useQuery<{ getOrders: Array<Order> }>(GET_ORDERS);

  return (
    <Carousel className="w-full">
      <CarouselContent className="w-full">
        {loading
          ? <Loading />
          :
          <>
            <CarouselItem
              className={cn({
                "lg:basis-auto flex justify-center grow": data?.getOrders.length === 0,
                "md:basis-1/2 lg:basis-1/4": data?.getOrders && data?.getOrders.length >= 4,
                "md:basis-1/2 lg:basis-1/3": data?.getOrders.length === 3,
                "md:basis-1/2 lg:basis-1/2": data?.getOrders && data?.getOrders.length <= 2,
              })}
              key={data?.getOrders.length}
            >
              <CreateOrder orders={data?.getOrders as Array<Order>} />
            </CarouselItem>
            {data?.getOrders.map((order, _, self) => (
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
          </>
        }

      </CarouselContent>
    </Carousel>
  );
};
