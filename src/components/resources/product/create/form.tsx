import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation, useQuery } from "@apollo/client";

import { apolloClient } from "@/lib/apollo";
import { CREATE_PRODUCT } from "@/service/mutation/product";
import { GET_PRODUCTS } from "@/service/queries/products";
import { GET_CATEGORIES } from "@/service/queries/category";
import { Category } from "../../category/category";
import { formProdcutSchema } from "../schemas";
import { IFormProduct, ProductInput } from "../product";
import Loading from "./loading";
import Fields from "../fields";
import { useAccordionContext } from "@/pages";

export const FormCreateProduct = () => {
  const [createProduct] = useMutation(CREATE_PRODUCT);
  const { data: categoryData, loading } = useQuery<{ getCategories: Array<Category> }>(GET_CATEGORIES)

  const { setAccordionValue } = useAccordionContext()

  const methods = useForm<IFormProduct>({
    resolver: zodResolver(formProdcutSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    getValues,
  } = methods;

  async function onSubmit(data: IFormProduct) {
    try {
      setAccordionValue("")
      setIsLoading(true);
      const formattedData: ProductInput = {
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
      setAccordionValue("products")
      toast("Produto criado com sucesso");
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
        isLoading || loading ? <Loading /> :
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Fields categories={categoryData?.getCategories as Array<Category>} isLoading={isLoading} />
          </form>
      }
    </FormProvider>
  );
};
