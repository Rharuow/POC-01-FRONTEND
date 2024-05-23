import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation, useQuery } from "@apollo/client";

import { Button } from "@/components/ui/button";
import { UPDATE_ORDER } from "@/service/mutation/order";
import { GET_CLIENTS } from "@/service/queries/clients";
import { Client } from "../../client/client";
import { GET_ORDERS } from "@/service/queries/order";

import { GET_PRODUCTS } from "@/service/queries/products";
import { Product } from "../../product/product";
import { Form } from "@/components/ui/form";
import { IFormOrder, Order } from "../order";
import { formOrderSchema } from "../schemas";
import { apolloClient } from "@/lib/apollo";
import Loading from "./loading";
import Fields from "../fields";


export const FormUpdateOrder = ({
  setEditModalIsOpen,
  order
}: {
  setEditModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  order: Order
}) => {
  const [updateOrder] = useMutation(UPDATE_ORDER);
  const { data: clientsData, loading: clientsLoading } = useQuery<{ getClients: Array<Client> }>(GET_CLIENTS)
  const { data: productsData, loading: productsLoading } = useQuery<{ getProducts: Array<Product> }>(GET_PRODUCTS)

  const methods = useForm<IFormOrder>({
    resolver: zodResolver(formOrderSchema),
    defaultValues: {
      clientId: order.client?.id,
      totalPrice: String(order.totalPrice),
      orderItems: order.orderItems
        ?.map(orderItem => ({
          amount: String(orderItem.amount),
          productId: orderItem.product?.id,
          totalPrice: String(orderItem.totalPrice)
        }))
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    getValues,
    control,
    formState: { errors },
  } = methods;

  const clientIdWatch = useWatch({ control, name: 'clientId' })

  async function onSubmit(data: IFormOrder) {
    const orderItems = getValues("orderItems").map(order => ({
      amount: Number(order.amount),
      productId: order.productId,
      totalPrice: Number(order.totalPrice)
    }));
    try {
      setIsLoading(true);

      await updateOrder({
        variables: { ...data, orderItems, id: order.id },
        update: (cache, { data: { updateOrder } }) => {
          const { getOrders } = apolloClient.readQuery({ query: GET_ORDERS })
          cache.writeQuery({
            query: GET_ORDERS,
            data: {
              getOrders: [...getOrders.filter((ord: Order) => ord.id !== order.id), updateOrder]
            }
          })
        }
      })

      toast("Venda atualizada com sucesso");
      setEditModalIsOpen(false);
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
            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                disabled={
                  Object.keys(errors).length !== 0 ||
                  isLoading || !clientIdWatch
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
            </div>
          </form>
      }
    </Form>

  );
};
