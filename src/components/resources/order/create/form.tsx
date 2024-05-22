import React, { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation, useQuery } from "@apollo/client";

import { Button } from "@/components/ui/button";
import { apolloClient } from "@/lib/apollo";
import { CREATE_ORDER } from "@/service/mutation/order";
import { GET_CLIENTS } from "@/service/queries/clients";
import { Client } from "../../client/client";
import { useOpenCreateOrderModalContext } from "../list";
import { GET_ORDERS } from "@/service/queries/order";
import { GET_PRODUCTS } from "@/service/queries/products";
import { Product } from "../../product/product";
import { MinusCircle, PlusCircle } from "lucide-react";
import { Form } from "@/components/ui/form";
import InputSelectGroup, { Items } from "@/components/ui/selectGroup";
import InputGroup from "@/components/ui/inputGroup";
import Loading from "./loading";
import { IFormCreateOrder } from "../order";
import { formOrderSchema } from "../schemas";

export const FormCreateOrder = () => {
  const [createOrder] = useMutation(CREATE_ORDER);
  const { data: clientsData, loading: clientsLoading } = useQuery<{ getClients: Array<Client> }>(GET_CLIENTS)
  const { data: productsData, loading: productsLoading } = useQuery<{ getProducts: Array<Product> }>(GET_PRODUCTS)

  const { setIsOpen } = useOpenCreateOrderModalContext();

  const methods = useForm<IFormCreateOrder>({
    resolver: zodResolver(formOrderSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    setValue,
    watch,
    getValues,
    control,
    formState: { errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "orderItems", // unique name for your Field Array
  });

  const clientIdWatch = useWatch({ control, name: 'clientId' })

  function handleSelectClient(e: string) {
    fields.length === 0 && handleAppend()
    setValue("totalPrice", String(productsData?.getProducts[0].price))
  }

  function handleSelectProduct(productId: string, index: number) {
    handleOrderAmount(watch(`orderItems.${index}.amount`), index, productId)
  }

  function handleOrderAmount(amount: number | string, index: number, productId: string) {
    setValue(
      `orderItems.${index}.totalPrice`,
      String((Number(productsData?.getProducts.find(product => product.id === productId)?.price) * Number(amount)).toFixed(2))
    )
    handleTotalPrice()
  }

  function handleTotalPrice() {
    const totalPrice = watch("orderItems").map((_, index) =>
      watch(`orderItems.${index}.totalPrice`)).reduce((acc, total) => acc = Number(acc) + Number(total), 0)
    setValue("totalPrice", String(totalPrice))
  }

  function handleAppend() {
    append({
      amount: String(1),
      productId: String(productsData?.getProducts[0].id),
      totalPrice: String(productsData?.getProducts[0].price)
    })
    handleTotalPrice()
  }

  function handleRemove(index: number) {
    remove(index)
    handleTotalPrice()
  }

  async function onSubmit(data: IFormCreateOrder) {
    try {
      setIsLoading(true);
      console.log(data);
      await createOrder({
        variables: data,
        update: (cache, { data: { createOrder } }) => {
          const { getOrders } = apolloClient.readQuery({ query: GET_ORDERS })
          cache.writeQuery({
            query: GET_ORDERS,
            data: {
              getOrders: [...getOrders, createOrder]
            }
          })
        }
      })
      toast("Venda criada com sucesso");
      setIsOpen(false);
    } catch (error) {
      console.log(error);
      toast("Desculpe, algo está errado!");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...methods}>
      {clientsLoading || productsLoading ? <Loading /> : <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          {
            <InputSelectGroup
              items={clientsData?.getClients.map(client => ({ label: String(client.name), value: String(client.id) })) as Items}
              name="clientId"
              onChange={(e: string) => handleSelectClient(e)}
              label="Clientes"
              placeholder="Selecione um cliente"
            />
          }
          {
            fields.map((field, index) => (
              <div className="grid grid-cols-5 gap-2" key={field.id}>
                <div className="flex flex-col col-span-2">
                  {
                    productsData && <InputSelectGroup
                      items={productsData.getProducts.map(product => ({ label: String(product.name), value: String(product.id) }))}
                      name={`orderItems.${index}.productId`}
                      onChange={(e: string) => handleSelectProduct(e, index)}
                      label="Produtos"
                      placeholder="Selecione um produto"
                    />
                  }
                </div>
                <InputGroup
                  name={`orderItems.${index}.amount`}
                  disabled={!watch(`orderItems.${index}.productId`)}
                  label="Quantidade"
                  inputMode="numeric"
                  type="number"
                  min={1}
                  onChange={(e) => handleOrderAmount(Number(e.target.value), index, getValues(`orderItems.${index}.productId`))}
                />
                <InputGroup
                  label="Valor total"
                  inputMode="numeric"
                  readOnly
                  type="number"
                  name={`orderItems.${index}.totalPrice`}
                />
                <Button
                  type="button"
                  className="rounded-full"
                  variant={"outline"}
                  onClick={() => index < fields.length - 1 ? handleRemove(index) : handleAppend()}
                >
                  {index < fields.length - 1 ? <MinusCircle /> : < PlusCircle />}
                </Button>
              </div>
            ))}
          <p>Total: {watch("totalPrice")?.toLocaleString("pt-BR", { currency: "BRL", maximumFractionDigits: 2, style: "currency" })}</p>
        </div>

        <Button
          type="submit"
          disabled={
            Object.keys(errors).length !== 0 ||
            isLoading || !clientIdWatch
          }
        >
          Salvar
        </Button>
      </form>}
    </Form>

  );
};
