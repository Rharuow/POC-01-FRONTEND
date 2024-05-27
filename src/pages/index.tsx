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
import LoadingClient from "@/components/resources/client/list/loading";
import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";

type AccordionValue = "clients" | "products" | "orders" | ""

const AccordionContext = createContext<{ setAccordionValue: Dispatch<SetStateAction<AccordionValue>> }>({ setAccordionValue: () => { } })

export const useAccordionContext = () => useContext(AccordionContext)

export default function Home() {
  const { data: dataClient, loading } = useQuery<{ getClients: Array<Client> }>(GET_CLIENTS);
  const [accordionValue, setAccordionValue] = useState<AccordionValue>("clients")

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
              >Clientes</AccordionTrigger>
              {loading ?
                <AccordionContent>
                  <LoadingClient />
                </AccordionContent> :
                <AccordionContent>
                  <ListClient clients={dataClient?.getClients as Array<Client>} />
                </AccordionContent>
              }
            </AccordionItem>
            <AccordionItem value="products">
              <AccordionTrigger>Produtos</AccordionTrigger>
              <AccordionContent>
                <ListProduct />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="orders">
              <AccordionTrigger>Vendas</AccordionTrigger>
              <AccordionContent>
                <ListOrder />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </AccordionContext.Provider>
      </div>
    </main >
  );
}
