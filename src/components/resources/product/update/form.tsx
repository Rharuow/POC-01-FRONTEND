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
import { Product } from "../product";
import { UPDATE_PRODUCT } from "@/service/mutation/product";
import { GET_PRODUCTS } from "@/service/queries/products";
import { Textarea } from "@/components/ui/textarea";
import { GET_CATEGORIES } from "@/service/queries/category";
import { Category } from "../../category/category";
import { Toggle } from "@/components/ui/toggle";
import { arraysAreIdentical } from "@/lib/validation/compareTwoArrays";

interface IFormUpdateProduct {
  name: string;
  description: string;
  price: number;
  inventory_quantity: number;
  categories?: Array<{ name: string }>
}

type ProductUpdateInput = {
  data: {
    name: { set: string };
    price: { set: number };
    description: { set: string };
    inventory_quantity: { set: number };
    categories?: {
      set: Array<{ categoryName: { equals: string } }>
    }
  };
  where: {
    id: string
  }
};

const schema = z.object({
  name: z.string().min(4, { message: "Pelo menos 4 caracteres" }),
  description: z.string().min(10, { message: "Pelo menos 10 caracteres" }),
});

export const FormUpdateProduct = ({ setEditModalIsOpen, product }: { setEditModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>; product: Product }) => {
  const [updateOneProduct] = useMutation(UPDATE_PRODUCT);
  const { data: categoryData } = useQuery<{ categories: Array<Category> }>(GET_CATEGORIES)

  const methods = useForm<IFormUpdateProduct>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: product.name,
      description: product.description,
      price: product.price,
      inventory_quantity: product.inventory_quantity,
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


  async function onSubmit(data: IFormUpdateProduct) {
    try {
      setIsLoading(true);
      const { name, description } = data;
      const formattedData: ProductUpdateInput = {
        data: {
          name: { set: name },
          description: { set: description },
          price: {
            set: parseFloat(String(getValues("price")))
          },
          inventory_quantity: { set: getValues("inventory_quantity") },
        },
        where: {
          id: String(product.id)
        }
      };

      // If some categories forms are different of the product's categories 
      if (!arraysAreIdentical(product.categories?.map(category => ({ name: category.category.name })), getValues("categories")?.map(category => ({ name: category.name })))) {
        await updateOneProduct({
          variables: {
            data: {
              categories: {
                deleteMany: {
                  productId: { equals: product.id }
                }
              }
            },
            where: { id: product.id }
          },
        });

        await updateOneProduct({
          variables: {
            data: {
              categories: {
                createMany: {
                  data: getValues("categories")?.map(category => ({ categoryName: category.name })),
                  skipDuplicates: true
                }
              }
            },
            where: { id: product.id }
          },
        });
      }

      await updateOneProduct({
        variables: formattedData,
        update: (cache, { data: { updateOneProduct } }) => {
          const { products } = apolloClient.readQuery({ query: GET_PRODUCTS });

          cache.writeQuery({
            query: GET_PRODUCTS,
            data: {
              products: [...products.filter((pdt: Product) => pdt.id !== product.id), updateOneProduct],
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
                <Toggle defaultPressed={getValues("categories")?.some(cat => cat.name === category.name)} size={"sm"} key={category.name} className="border rounded-full" onClick={() => handleSelectCategory(String(category.name))}>
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
              <input key={field.id} className="text-black" {...register(`categories.${index}.name`)} readOnly hidden />
            ))}
          </div>
        }

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
    </FormProvider>
  );
};
