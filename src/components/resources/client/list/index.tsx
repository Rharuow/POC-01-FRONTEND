import React from "react";
import { PlusCircle } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { GET_CLIENTS } from "@/service/queries/clients";
import { useQuery } from "@apollo/client";
import { CardClient } from "./card";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateClient } from "../create";

export const ListClient = () => {
  const { data, loading } = useQuery<{ clients: Array<Client> }>(GET_CLIENTS);

  console.log(data);

  return (
    <Carousel className="w-full">
      <CarouselContent className="w-full">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <CarouselItem
                className="md:basis-1/2 lg:basis-1/4 flex justify-center"
                key={index}
              >
                <Skeleton className="w-full h-20" />
              </CarouselItem>
            ))
          : data?.clients.map((client, _, self) => (
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
        <CarouselItem
          className={cn("md:basis-1/2", {
            "lg:basis-1/4": self.length >= 4,
            "lg:basis-1/3": self.length === 3,
            "lg:basis-1/2": self.length <= 2,
            "lg:basis-auto flex justify-center w-full": self.length === 0,
          })}
          key={data?.clients.length}
        >
          <Dialog>
            <DialogTrigger asChild>
              <Card
                className={cn(
                  "h-full bg-transparent text-white border-dashed hover:cursor-pointer p-0",
                  {
                    "min-h-20": self.length === 0,
                  }
                )}
              >
                <CardContent className="flex flex-col gap-4 justify-center items-center p-4">
                  <PlusCircle />
                  {self.length === 0 ? (
                    <p>Nenhum cliente Cadastrado</p>
                  ) : (
                    <p>Adicionar Cliente</p>
                  )}
                </CardContent>
              </Card>
            </DialogTrigger>
            <CreateClient />
          </Dialog>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
};
