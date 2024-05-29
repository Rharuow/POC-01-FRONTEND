import { NavBar } from "@/components/nav-bar";
import { ListClient } from "@/components/resources/client/list";
import { ListProduct } from "@/components/resources/product/list";
import { ListOrder } from "@/components/resources/order/list";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useQuery } from "@apollo/client";
import { Client } from "@/components/resources/client/client";
import { GET_CLIENTS } from "@/service/queries/clients";
import LoadingClients from "@/components/resources/client/list/loading";
import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";
import { Product } from "@/components/resources/product/product";
import { GET_PRODUCTS } from "@/service/queries/products";
import LoadingProducts from "@/components/resources/product/list/loading";
import { Order } from "@/components/resources/order/order";
import { GET_ORDERS } from "@/service/queries/order";
import LoadingOrders from "@/components/resources/order/list/loading";

type AccordionValue = "clients" | "products" | "orders" | ""

const AccordionContext = createContext<{ setAccordionValue: Dispatch<SetStateAction<AccordionValue>> }>({ setAccordionValue: () => { } })

export const useAccordionContext = () => useContext(AccordionContext)

export default function Home() {
  const { data: dataClients, loading: loadingClients } = useQuery<{ getClients: Array<Client> }>(GET_CLIENTS);
  const { data: dataProducts, loading: loadingProducts } = useQuery<{ getProducts: Array<Product> }>(GET_PRODUCTS)
  const { data: dataOrders, loading: loadingOrders } = useQuery<{ getOrders: Array<Order> }>(GET_ORDERS);

  const [accordionValue, setAccordionValue] = useState<AccordionValue>("")

  return (
    <main
      className="bg-gray-900 min-h-svh flex flex-col gap-4 justify-between text-white"
    >
      <NavBar />

      <div className="px-4 flex justify-center grow">
        <AccordionContext.Provider value={{ setAccordionValue }}>
          <Accordion
            type="single"
            value={accordionValue}
            collapsible
            className="w-full"
          >
            <AccordionItem value="clients">
              <AccordionTrigger
                onClick={() => setAccordionValue(prevState => prevState === "clients" ? "" : "clients")}
              >
                Clientes
              </AccordionTrigger>
              {loadingClients ?
                <AccordionContent>
                  <LoadingClients />
                </AccordionContent> :
                <AccordionContent>
                  <ListClient clients={dataClients?.getClients as Array<Client>} />
                </AccordionContent>
              }
            </AccordionItem>
            <AccordionItem value="products">
              <AccordionTrigger
                onClick={() => setAccordionValue(prevState => prevState === "products" ? "" : "products")}
              >
                Produtos
              </AccordionTrigger>
              {loadingProducts ?
                <AccordionContent>
                  <LoadingProducts />
                </AccordionContent>
                :
                <AccordionContent>
                  <ListProduct products={dataProducts?.getProducts as Array<Product>} />
                </AccordionContent>
              }
            </AccordionItem>
            <AccordionItem value="orders">
              <AccordionTrigger
                onClick={() => setAccordionValue(prevState => prevState === "orders" ? "" : "orders")}
              >
                Vendas
              </AccordionTrigger>
              {
                loadingOrders ?
                  <AccordionContent>
                    <LoadingOrders />
                  </AccordionContent>
                  :
                  <AccordionContent>
                    <ListOrder orders={dataOrders?.getOrders as Array<Order>} />
                  </AccordionContent>
              }
            </AccordionItem>
          </Accordion>
        </AccordionContext.Provider>
      </div>
    </main >
  );
}
