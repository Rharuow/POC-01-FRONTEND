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
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { CREATE_SALE } from "@/service/mutation/sale";

type SaleCreateInput = {
  data: {
    client: {
      connect: {
        id: string;
      }
    };
    orders: {
      createMany: {
        data: Array<
          {
            productId: string;
            amount: number;
            totalPrice: number;
          }
        >
      }
    };
    totalPrice: number
  };
};

type IFormCreateSale = {
  clientId: string;
  orders: Array<{
    productId: string;
    amount: number;
    totalPrice: number;
  }>;
  totalPrice: number
}

const schema = z.object({
  name: z.string().min(4, { message: "Pelo menos 4 caracteres" }),
  orders: z.array(z.object({
    productId: z.string(),
    amount: z.number(),
    totalPrice: z.number()
  })).nonempty(),
  totalProce: z.number()
});

export const FormCreateSale = () => {
  const [createOneSale] = useMutation(CREATE_SALE);
  const { data: categoryData } = useQuery<{ categories: Array<Category> }>(GET_CATEGORIES)

  const { setIsOpen } = useOpenCreateSaleModalContext();

  const methods = useForm<IFormCreateSale>({
    resolver: zodResolver(schema),
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

  async function onSubmit(data: IFormCreateSale) {

    try {
      setIsLoading(true);
      const formattedData: SaleCreateInput = {

      };

      await createOneSale({
        variables: formattedData,
        update: (cache, { data: { createOneSale } }) => {
          const { products } = apolloClient.readQuery({ query: GET_PRODUCTS });

          cache.writeQuery({
            query: GET_PRODUCTS,
            data: {
              products: [...products, createOneSale],
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
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 md:grid md:grid-cols-3">
          {isLoading ? (
            <Skeleton className="w-full h-10 rounded-full" />
          ) : (
            <div className="flex flex-col">
              <Input
                label="Nome"
                {...register("name")}
                autoFocus={false}
                className={cn({
                  "border border-red-700": errors && errors.name,
                })}
              />
              {errors && errors.name && (
                <span className="text-xs text-red-400 font-bold">
                  {errors.name.message}
                </span>
              )}
            </div>
          )}
          {isLoading ? (
            <Skeleton className="w-full h-10 rounded-full" />
          ) : (
            <div className="flex flex-col">
              <Input
                label="Valor"
                inputMode="numeric"
                step={0.01}
                {...register("price")}
                className={cn({
                  "border border-red-700": errors && errors.price,
                })}
                type="number"
              />
              {errors && errors.price && (
                <span className="text-xs text-red-400 font-bold">
                  {errors.price.message}
                </span>
              )}
            </div>
          )}
          {isLoading ? (
            <Skeleton className="w-full h-10 rounded-full" />
          ) : (
            <div className="flex flex-col">
              <Input
                label="Quantidade em estoque"
                inputMode="numeric"
                {...register("inventory_quantity")}
                className={cn({
                  "border border-red-700": errors && errors.inventory_quantity,
                })}
                type="number"
              />
              {errors && errors.inventory_quantity && (
                <span className="text-xs text-red-400 font-bold">
                  {errors.inventory_quantity.message}
                </span>
              )}
            </div>
          )}
        </div>
        {isLoading ? (
          <Skeleton className="w-full h-10 rounded-full" />
        ) : (
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
        )}
        {isLoading ? (
          <Skeleton className="w-full h-10 rounded-full" />
        ) :
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
        }

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
    </FormProvider>
  );
};
