import React from "react";

import { Card, CardHeader } from "@/components/ui/card";
import { Product } from "../product";

export const CardProduct = ({ product }: { product: Product }) => {
  return (
    <Card className="h-full relative">
      <CardHeader className="flex justify-between">
        <h1>{product.name}</h1>
      </CardHeader>
      <div className="absolute top-1 right-1 flex gap-1">
        {/* <DeleteClient product={product} />
        <UpdateClient id={String(product.id)} /> */}
      </div>
    </Card>
  );
};
