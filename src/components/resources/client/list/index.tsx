import React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { GET_CLIENTS } from "@/service/queries/clients";
import { useQuery } from "@apollo/client";
import { CardClient } from "./card";
import { cn } from "@/lib/utils";
import { CreateClient } from "../create";
import { Client } from "../client";
import Loading from "./loading";

export const ListClient = () => {
  const { data, loading } = useQuery<{ getClients: Array<Client> }>(GET_CLIENTS);


  return (
    <Carousel className="w-full">
      <CarouselContent className="w-full">
        <CarouselItem
          className={cn({
            "lg:basis-auto flex justify-center grow": data?.getClients.length === 0,
            "md:basis-1/2 lg:basis-1/4": data?.getClients && data?.getClients.length >= 4,
            "md:basis-1/2 lg:basis-1/3": data?.getClients.length === 3,
            "md:basis-1/2 lg:basis-1/2": data?.getClients && data?.getClients.length <= 2,
          })}
          key={data?.getClients.length}
        >
          <CreateClient clients={data?.getClients} />
        </CarouselItem>
        {loading
          ? <Loading />
          : data?.getClients.map((client, _, self) => (
            <CarouselItem
              className={cn("md:basis-1/2", {
                "lg:basis-1/4": self.length >= 4,
                "lg:basis-1/3": self.length === 3,
                "lg:basis-1/2": self.length <= 2,
              })}
              key={client.id}
            >
              <CardClient client={client} />
            </CarouselItem>
          ))}
      </CarouselContent>
    </Carousel>
  );
};
