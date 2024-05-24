import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@apollo/client";
import { apolloClient } from "@/lib/apollo";
import { IFormProduct, Product, ProductInput } from "../product";
import { UPDATE_PRODUCT } from "@/service/mutation/product";
import { GET_PRODUCTS } from "@/service/queries/products";
import { GET_CATEGORIES } from "@/service/queries/category";
import { Category } from "../../category/category";
import Loading from "./loading";
import { formProdcutSchema } from "../schemas";
import Fields from "../fields";

export const FormUpdateProduct = ({ setEditModalIsOpen, product }: { setEditModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>; product: Product }) => {
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const { data: categoryData, loading } = useQuery<{ getCategories: Array<Category> }>(GET_CATEGORIES)

  const methods = useForm<IFormProduct>({
    resolver: zodResolver(formProdcutSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      price: String(product.price),
      inventory_quantity: String(product.inventory_quantity),
      categories: product.categories?.map(cat => ({ name: cat.categoryName }))
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
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

  return (
    <FormProvider {...methods}>
      {
        isLoading || loading ?
          <Loading /> :
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <Fields categories={categoryData?.getCategories as Array<Category>} isLoading={isLoading} />

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
