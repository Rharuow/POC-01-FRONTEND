import React, { useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@apollo/client";
import { Skeleton } from "@/components/ui/skeleton";
import { apolloClient } from "@/lib/apollo";
import { IFormProduct, Product, ProductInput } from "../product";
import { UPDATE_PRODUCT } from "@/service/mutation/product";
import { GET_PRODUCTS } from "@/service/queries/products";
import { Textarea } from "@/components/ui/textarea";
import { GET_CATEGORIES } from "@/service/queries/category";
import { Category } from "../../category/category";
import { Toggle } from "@/components/ui/toggle";
import { arraysAreIdentical } from "@/lib/validation/compareTwoArrays";
import Loading from "./loading";
import InputGroup from "@/components/ui/inputGroup";
import { formProdcutSchema } from "../schemas";

export const FormUpdateProduct = ({ setEditModalIsOpen, product }: { setEditModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>; product: Product }) => {
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const { data: categoryData } = useQuery<{ categories: Array<Category> }>(GET_CATEGORIES)

  const methods = useForm<IFormProduct>({
    resolver: zodResolver(formProdcutSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      price: String(product.price),
      inventory_quantity: String(product.inventory_quantity),
      categories: product.categories?.map(cat => ({ name: cat.category.name }))
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    register,
    getValues,
    control,
    formState: { errors },
  } = methods;


  async function onSubmit(data: IFormProduct) {
    try {
      setIsLoading(true);
      const { name, description, price, inventory_quantity, categories } = data;
      const formattedData: ProductInput & { id: string } = {
        id: String(product.id),
        name,
        description,
        price: parseFloat(String(price)),
        inventory_quantity: Number(inventory_quantity),
        categories: categories.map(category => category.name)

      };

      await updateProduct({
        variables: formattedData,
        update: (cache, { data: { updateProduct } }) => {
          const { getProducts } = apolloClient.readQuery({ query: GET_PRODUCTS });

          cache.writeQuery({
            query: GET_PRODUCTS,
            data: {
              getProducts: [...getProducts.filter((pdt: Product) => pdt.id !== product.id), updateProduct],
            },
          });
        },
      });
      toast("Produto atualizado com sucesso");
      setEditModalIsOpen(false);
    } catch (error) {
      console.log(error);
      toast("Desculpe, algo está errado!");
    } finally {
      setIsLoading(false);
    }
  }

  const { fields, append, remove } = useFieldArray({
    control,
    name: "categories", // unique name for your Field Array
  });

  function handleSelectCategory(category: string) {
    getValues("categories")?.some(cat => cat.name === category) ?
      remove(fields.findIndex(field => field.name === category)) :
      append({ name: category })
  }

  return (
    <FormProvider {...methods}>
      {
        isLoading ?
          <Loading /> :
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <div className="flex flex-col gap-2 md:grid md:grid-cols-3">
              <InputGroup label="Nome" name="name" />
              <InputGroup label="Valor" name="price" inputMode="numeric" step={0.01} min={0} type="number" />
              <InputGroup label="Quantidade em estoque" name="inventory_quantity" inputMode="numeric" min={0} step={1} type="number" />
            </div>
            <div className="flex flex-col">
              <Textarea
                label="Descrição"
                {...register("description")}
                className={cn({
                  "border border-red-700": errors && errors.description,
                })}
              />
              {errors && errors.description && (
                <span className="text-xs text-red-400 font-bold">
                  {errors.description.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <p>Categorias</p>
              <div className="flex flex-wrap gap-2">
                {categoryData && categoryData.categories.length > 0 && categoryData.categories.map((category) => (
                  <Toggle defaultPressed={getValues("categories")?.some(cat => cat.name === category.name)} size={"sm"} key={category.name} className="border rounded-full" onClick={() => handleSelectCategory(String(category.name))}>
                    {category.name}
                  </Toggle>
                ))}

              </div>
              {fields.length > 0 && fields.map((field, index) => (
                <input key={field.id} className="text-black" {...register(`categories.${index}.name`)} readOnly hidden />
              ))}
            </div>

            <Button
              disabled={
                Object.keys(errors).length !== 0 ||
                isLoading
              }
            >
              Salvar
            </Button>

            <Button
              type="button"
              variant={"outline"}
              onClick={() => setEditModalIsOpen(false)}
            >
              Cancelar
            </Button>
          </form>
      }
    </FormProvider>
  );
};
