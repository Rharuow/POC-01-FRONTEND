import React, { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation, useQuery } from "@apollo/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { apolloClient } from "@/lib/apollo";
import { UPDATE_SALE } from "@/service/mutation/sale";
import { GET_CLIENTS } from "@/service/queries/clients";
import { Client } from "../../client/client";
import { GET_SALES } from "@/service/queries/sale";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GET_PRODUCTS } from "@/service/queries/products";
import { Product } from "../../product/product";
import { MinusCircle, PlusCircle } from "lucide-react";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Sale } from "../sale";
import { arraysAreIdentical } from "@/lib/validation/compareTwoArrays";

type IFormUpdateSale = {
  clientId: string;
  orders: Array<{
    productId: string;
    amount: number;
    totalPrice: number;
  }>;
  totalPrice: number
}

const schema = z.object({
  clientId: z.string({
    required_error: "Selecione algum cliente",
  }),
  // orders: z.array(z.object({
  //   // productId: z.string(),
  //   amount: z.preprocess((a) => parseInt(z.string().parse(a), 10),
  //     z.number()),
  //   totalPrice: z.preprocess((a) => parseFloat(z.string().parse(a)),
  //     z.number())
  // })).nonempty()
});

export const FormUpdateSale = ({ setEditModalIsOpen, sale }: { setEditModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>; sale: Sale }) => {
  const [updateOneSale] = useMutation(UPDATE_SALE);
  const { data: clientsData, loading: clientsLoading } = useQuery<{ clients: Array<Client> }>(GET_CLIENTS)
  const { data: productsData, loading: productsLoading } = useQuery<{ products: Array<Product> }>(GET_PRODUCTS)

  const RealCurrency = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  })

  const methods = useForm<IFormUpdateSale>({
    resolver: zodResolver(schema),
    defaultValues: {
      clientId: sale.client?.id,
      totalPrice: sale.totalPrice,
      orders: sale.orders?.map(order => ({ amount: order.amount, productId: order.product?.id, totalPrice: order.totalPrice }))
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    setValue,
    watch,
    register,
    getValues,
    control,
    formState: { errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "orders", // unique name for your Field Array
  });

  const clientIdWatch = useWatch({ control, name: 'clientId' })

  async function onSubmit(data: IFormUpdateSale) {

    console.log(getValues("orders").map(order => ({
      amount: Number(order.amount),
      productId: order.productId,
      totalPrice: Number(order.totalPrice)
    })));


    try {
      setIsLoading(true);

      // if client is change
      if (getValues("clientId") !== sale.client) {
        await updateOneSale({
          variables: {
            data: {
              client: {
                connect: {
                  id: getValues("clientId")
                }
              }
            },
            where: {
              id: sale.id
            }
          },
        })
      }

      // if order is change
      if (!arraysAreIdentical(getValues("orders"), sale.orders?.map(order => ({ amount: order.amount, totalPrice: order.totalPrice, productId: order.product?.id })))) {
        await updateOneSale({
          variables: {
            data: {
              orders: {
                deleteMany: {
                  saleId: { equals: sale.id }
                }
              }
            },
            where: {
              id: sale.id
            }
          }
        });

        await updateOneSale({
          variables: {
            data: {
              orders: {
                createMany: {
                  data: getValues("orders").map(order => ({
                    amount: Number(order.amount),
                    productId: order.productId,
                    totalPrice: Number(order.totalPrice)
                  }))
                }
              },
              totalPrice: { set: getValues("totalPrice") }
            },
            where: {
              id: sale.id
            }
          }
        });
      }
      toast("Venda atualizada com sucesso");
      setEditModalIsOpen(false);
    } catch (error) {
      console.log(error);
      toast("Desculpe, algo está errado!");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSelectProduct(productId: string, index: number) {
    handleOrderAmount(watch(`orders.${index}.amount`), index, productId)
  }

  function handleOrderAmount(amount: number, index: number, productId: string) {
    setValue(
      `orders.${index}.totalPrice`,
      parseFloat((Number(productsData?.products.find(product => product.id === productId)?.price) * amount).toFixed(2))
    )
    handleTotalPrice()
  }

  function handleTotalPrice() {
    const totalPrice = watch("orders").map((_, index) => watch(`orders.${index}.totalPrice`)).reduce((acc, total) => acc += total, 0)
    setValue("totalPrice", totalPrice)
  }

  function handleAppend() {
    append({ amount: 1, productId: String(productsData?.products[0].id), totalPrice: Number(productsData?.products[0].price) })
    handleTotalPrice()
  }

  function handleRemove(index: number) {
    remove(index)
    handleTotalPrice()
  }

  return (
    <Form {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          {isLoading || clientsLoading ? (
            <Skeleton className="w-full h-10 rounded-full" />
          ) : (
            <div className="flex flex-col">
              <FormField
                control={control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={(e) => {
                      field.onChange(e)
                      fields.length === 0 && append({
                        amount: 1,
                        productId: String(productsData?.products[0].id),
                        totalPrice: Number(productsData?.products[0].price)
                      })
                      setValue("totalPrice", Number(productsData?.products[0].price))
                    }} defaultValue={field.value}>
                      <SelectTrigger className={cn({
                        "border border-red-700": errors && errors.clientId
                      })}>
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Clientes</SelectLabel>
                          {clientsData?.clients.map(client => (
                            <SelectItem value={String(client.id)} key={client.id}>{client.name}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
            </div>
          )}
          {isLoading || productsLoading ? (
            <Skeleton className="w-full h-10 rounded-full" />
          ) :
            fields.map((field, index) => (
              <div className="grid grid-cols-5 gap-2" key={field.id}>
                <div className="flex flex-col col-span-2">
                  <input key={`orders.${index}.productId`} {...register(`orders.${index}.productId`)} readOnly hidden />
                  <FormField
                    control={control}
                    name={`orders.${index}.productId`}
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={(e) => {
                          handleSelectProduct(e, index)

                          field.onChange(e)
                        }} defaultValue={field.value}>
                          <SelectTrigger className={cn({
                            "border border-red-700": errors && errors.orders && errors.orders[index]?.productId
                          })}>
                            <SelectValue placeholder="Selecione um produto" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Produtos</SelectLabel>
                              {productsData?.products.map(product => (
                                <SelectItem value={String(product.id)} key={product.id}>
                                  {product.name} ({RealCurrency.format(Number(product.price))})
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col">
                  <Input
                    label="Quantidade"
                    inputMode="numeric"
                    type="number"
                    disabled={!watch(`orders.${index}.productId`)}
                    {...register(`orders.${index}.amount`, {
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                        handleOrderAmount(Number(e.target.value), index, getValues(`orders.${index}.productId`))
                      }
                    })}
                    min={1}
                    className={cn({
                      "border border-red-700": errors && errors.orders && errors.orders[index] && errors.orders[index]?.amount,
                    })}
                  />
                  {errors && errors.orders && (
                    <span className="text-xs text-red-400 font-bold">
                      {errors.orders[index]?.amount?.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <Input
                    label="Valor total"
                    inputMode="numeric"
                    readOnly
                    {...register(`orders.${index}.totalPrice`)}
                    className={cn({
                      "border border-red-700": errors && errors.orders && errors.orders[index] && errors.orders[index]?.amount,
                    })}
                    type="number"
                  />
                  {errors && errors.orders && (
                    <span className="text-xs text-red-400 font-bold">
                      {errors.orders[index]?.amount?.message}
                    </span>
                  )}
                </div>
                <Button type="button" className="rounded-full" variant={"outline"} onClick={() => index < fields.length - 1 ? handleRemove(index) : handleAppend()}>{index < fields.length - 1 ? <MinusCircle /> : < PlusCircle />}</Button>
              </div>
            ))
          }
          {/* <input hidden readOnly {...register("totalPrice")} /> */}
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
        <Button variant={"outline"} type="button" onClick={() => setEditModalIsOpen(false)}>Cancelar</Button>
      </form>
    </Form>

  );
};
