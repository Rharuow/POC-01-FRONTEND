import React, { useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation, useQuery } from "@apollo/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { apolloClient } from "@/lib/apollo";
import { CREATE_PRODUCT } from "@/service/mutation/product";
import { useOpenCreateProductModalContext } from "../list";
import { GET_PRODUCTS } from "@/service/queries/products";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { GET_CATEGORIES } from "@/service/queries/category";
import { Category } from "../../category/category";
import { formProdcutSchema } from "../schemas";
import { IFormCreateProduct, ProcutCreateInput } from "../product";
import InputGroup from "@/components/ui/inputGroup";
import Loading from "./loading";

export const FormCreateProduct = () => {
  const [createProduct] = useMutation(CREATE_PRODUCT);
  const { data: categoryData } = useQuery<{ categories: Array<Category> }>(GET_CATEGORIES)

  const { setIsOpen } = useOpenCreateProductModalContext();

  const methods = useForm<IFormCreateProduct>({
    resolver: zodResolver(formProdcutSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    getValues,
    register,
    control,
    formState: { errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "categories", // unique name for your Field Array
  });

  async function onSubmit(data: IFormCreateProduct) {
    try {
      setIsLoading(true);
      const formattedData: ProcutCreateInput = {
        name: data.name,
        price: parseFloat(String(getValues("price"))),
        description: data.description,
        inventory_quantity: data.inventory_quantity,
        ...(data.categories && {
          categories: data.categories.map(category => (category.name))
        })
      };

      await createProduct({
        variables: formattedData,
        update: (cache, { data: { createProduct } }) => {
          const { getProducts } = apolloClient.readQuery({ query: GET_PRODUCTS });

          cache.writeQuery({
            query: GET_PRODUCTS,
            data: {
              getProducts: [...getProducts, createProduct],
            },
          });
        },
      });
      toast("Produto criado com sucesso");
      setIsOpen(false);
    } catch (error) {
      console.log(error);
      toast("Desculpe, algo está errado!");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSelectCategory(category: string) {
    getValues("categories").some(cat => cat.name === category) ?
      remove(fields.findIndex(field => field.name === category)) :
      append({ name: category })
  }

  return (
    <FormProvider {...methods}>
      {
        isLoading ? <Loading /> :
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
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
                    <Toggle size={"sm"} key={category.name} className="border rounded-full" onClick={() => handleSelectCategory(String(category.name))}>
                      {category.name}
                    </Toggle>
                  ))}
                  {/* <Toggle
                size={"sm"}
                className="border border-green-500 text-green-500 rounded-full transition duration-300 hover:text-green-700 hover:border-green-700"
              >
                + Categoria
              </Toggle> */}
                </div>
                {fields.length > 0 && fields.map((field, index) => (
                  <input key={field.id} {...register(`categories.${index}.name`)} readOnly hidden />
                ))}
              </div>
            </div>

            <Button
              type="submit"
              disabled={
                Object.keys(errors).length !== 0 ||
                isLoading
              }
            >
              Salvar
            </Button>
          </form>
      }
    </FormProvider>
  );
};
