import React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useQuery } from "@apollo/client";
import { CardProduct } from "./card";
import { cn } from "@/lib/utils";
import { Product } from "../product";
import { GET_PRODUCTS } from "@/service/queries/products";
import { CreateProduct } from "../create";
import Loading from "./loading";

export const ListProduct = () => {
  const { data, loading } = useQuery<{ getProducts: Array<Product> }>(GET_PRODUCTS);

  return (
    <Carousel className="w-full">
      <CarouselContent className="w-full">
        {loading
          ? <Loading />
          :
          <>
            <CarouselItem
              className={cn({
                "lg:basis-auto flex justify-center grow": data?.getProducts.length === 0,
                "md:basis-1/2 lg:basis-1/4": data?.getProducts && data?.getProducts.length >= 4,
                "md:basis-1/2 lg:basis-1/3": data?.getProducts.length === 3,
                "md:basis-1/2 lg:basis-1/2": data?.getProducts && data?.getProducts.length <= 2,
              })}
              key={data?.getProducts.length}
            >
              <CreateProduct products={data?.getProducts as Array<Product>} />
            </CarouselItem>
            {data?.getProducts.map((product, _, self) => (
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
          </>
        }

      </CarouselContent>
    </Carousel>
  );
};
