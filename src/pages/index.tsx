import { NavBar } from "@/components/nav-bar";
import { ListClient } from "@/components/resources/client/list";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`bg-gray-900 min-h-svh flex flex-col gap-4 justify-between text-white ${inter.className}`}
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
              Yes. It comes with default styles that matches the other
              components&apos; aesthetic.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is it animated?</AccordionTrigger>
            <AccordionContent>
              Yes. It&apos;s animated by default, but you can disable it if you
              prefer.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </main>
  );
}
