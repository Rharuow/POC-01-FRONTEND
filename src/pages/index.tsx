import { NavBar } from "@/components/nav-bar";
import { ListClient } from "@/components/resources/client/list";
import { ListProduct } from "@/components/resources/product/list";
import { ListSale } from "@/components/resources/sale/list";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Inter } from "next/font/google";


export default function Home() {
  return (
    <main
      className="bg-gray-900 min-h-svh flex flex-col gap-4 justify-between text-white"
    >
      <NavBar />

      <div className="px-4 flex justify-center grow">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="clients">
            <AccordionTrigger>Clientes</AccordionTrigger>
            <AccordionContent>
              <ListClient />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="products">
            <AccordionTrigger>Produtos</AccordionTrigger>
            <AccordionContent>
              <ListProduct />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Vendas</AccordionTrigger>
            <AccordionContent>
              <ListSale />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </main>
  );
}
