import React from "react";
import { PlusCircle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormCreateProduct } from "./form";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Product } from "../product";

export const CreateProduct = ({ products }: { products: Array<Product> }) => {
  return (
    <Dialog >
      <DialogTrigger
        asChild
      >
        <Card
          className={cn(
            "h-full w-full bg-transparent text-white border-dashed hover:cursor-pointer p-0",
            {
              "min-h-20": products.length === 0,
            }
          )}
        >
          <CardContent className="flex flex-col gap-4 justify-center items-center p-4">
            <PlusCircle />
            {products.length === 0 ? (
              <p>Nenhum produto Cadastrado</p>
            ) : (
              <p>Adicionar produto</p>
            )}
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent
        className="max-w-[425px] md:max-w-[525px] lg:max-w-[825px]"
      >
        <DialogHeader>
          <DialogTitle>Adicionar Produto</DialogTitle>
        </DialogHeader>
        <FormCreateProduct />
      </DialogContent>
    </Dialog>

  );
};
