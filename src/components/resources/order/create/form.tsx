import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation, useQuery } from "@apollo/client";

import { Button } from "@/components/ui/button";
import { apolloClient } from "@/lib/apollo";
import { CREATE_ORDER } from "@/service/mutation/order";
import { GET_CLIENTS } from "@/service/queries/clients";
import { Client } from "../../client/client";
import { GET_ORDERS } from "@/service/queries/order";
import { GET_PRODUCTS } from "@/service/queries/products";
import { Product } from "../../product/product";
import { Form } from "@/components/ui/form";
import Loading from "./loading";
import { IFormOrder } from "../order";
import { formOrderSchema } from "../schemas";
import Fields from "../fields";
import { useAccordionContext } from "@/pages";
import { DialogClose } from "@/components/ui/dialog";

export const FormCreateOrder = () => {
  const [createOrder] = useMutation(CREATE_ORDER);
  const { data: clientsData, loading: clientsLoading } = useQuery<{ getClients: Array<Client> }>(GET_CLIENTS)
  const { data: productsData, loading: productsLoading } = useQuery<{ getProducts: Array<Product> }>(GET_PRODUCTS)

  const { setAccordionValue } = useAccordionContext()

  const methods = useForm<IFormOrder>({
    resolver: zodResolver(formOrderSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods;


  const clientIdWatch = useWatch({ control, name: 'clientId' })

  async function onSubmit(data: IFormOrder) {
    try {
      setAccordionValue("")
      setIsLoading(true);
      await createOrder({
        variables: data,
        update: (cache, { data: { createOrder } }) => {
          const data = apolloClient.readQuery({ query: GET_ORDERS })
          cache.writeQuery({
            query: GET_ORDERS,
            data: {
              getOrders: [...data.getOrders, createOrder]
            }
          })
        }
      })
      setAccordionValue("orders")
      toast("Venda criada com sucesso");
    } catch (error) {
      console.log(error);
      toast("Desculpe, algo está errado!");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...methods}>
      {
        clientsLoading || productsLoading ? <Loading /> :
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <Fields
              clients={clientsData?.getClients as Array<Client>}
              products={productsData?.getProducts as Array<Product>}
            />
            <DialogClose
              className="bg-primary text-white p-2 rounded-lg"
              type="submit"
              disabled={
                Object.keys(errors).length !== 0 ||
                isLoading || !clientIdWatch
              }>
              Salvar
            </DialogClose>
          </form>
      }
    </Form>

  );
};
