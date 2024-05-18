import React, { createContext, useContext, useState } from "react";
import { PlusCircle } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@apollo/client";
import { CardProduct } from "./card";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Product } from "../product";
import { GET_PRODUCTS } from "@/service/queries/products";
import { CreateProduct } from "../create";

const OpenCreateProductModalContext = createContext<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  isOpen: false,
  setIsOpen: () => { },
});

export const useOpenCreateProductModalContext = () =>
  useContext(OpenCreateProductModalContext);

export const ListProduct = () => {
  const { data, loading } = useQuery<{ products: Array<Product> }>(GET_PRODUCTS);

  const [isOpenCreateProductModal, setIsOpenCreateProductModal] = useState(false);

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
          : data?.products.map((product, _, self) => (
            <CarouselItem
              className={cn("md:basis-1/2", {
                "lg:basis-1/4": self.length >= 4,
                "lg:basis-1/3": self.length === 3,
                "lg:basis-1/2": self.length <= 2,
              })}
              key={product.id}
            >
              <CardProduct product={product} />
            </CarouselItem>
          ))}
        <CarouselItem
          className={cn({
            "lg:basis-auto flex justify-center grow": data?.products.length === 0,
            "md:basis-1/2 lg:basis-1/4": data?.products && data?.products.length >= 4,
            "md:basis-1/2 lg:basis-1/3": data?.products.length === 3,
            "md:basis-1/2 lg:basis-1/2": data?.products && data?.products.length <= 2,
          })}
          key={data?.products.length}
        >
          <OpenCreateProductModalContext.Provider
            value={{
              isOpen: isOpenCreateProductModal,
              setIsOpen: setIsOpenCreateProductModal,
            }}
          >
            <Dialog open={isOpenCreateProductModal}>
              <DialogTrigger
                asChild
                onClick={() => setIsOpenCreateProductModal(true)}
              >
                <Card
                  className={cn(
                    "h-full w-full bg-transparent text-white border-dashed hover:cursor-pointer p-0",
                    {
                      "min-h-20": data?.products.length === 0,
                    }
                  )}
                >
                  <CardContent className="flex flex-col gap-4 justify-center items-center p-4">
                    <PlusCircle />
                    {data?.products.length === 0 ? (
                      <p>Nenhum produto Cadastrado</p>
                    ) : (
                      <p>Adicionar produto</p>
                    )}
                  </CardContent>
                </Card>
              </DialogTrigger>
              <CreateProduct />
            </Dialog>
          </OpenCreateProductModalContext.Provider>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
};