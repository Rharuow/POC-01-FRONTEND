import React from "react";

import { Card, CardHeader } from "@/components/ui/card";
import { Product } from "../product";
import DeleteProduct from "../delete";
import UpdateProduct from "../update";

export const CardProduct = ({ product }: { product: Product }) => {
  return (
    <Card className="h-full relative">
      <CardHeader className="flex justify-between">
        <h1>{product.name}</h1>
      </CardHeader>
      <div className="absolute top-1 right-1 flex gap-1">
        <DeleteProduct product={product} />
        <UpdateProduct id={String(product.id)} />
      </div>
    </Card>
  );
};
