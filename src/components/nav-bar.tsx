import { MenuIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";

export const NavBar = () => {
  return (
    <div className="p-2 rounded-b bg-gray-800 flex text-white">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <div className="flex grow justify-center items-center">
        <p>POC - Store</p>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">
            <MenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <div className="flex flex-col gap-4 h-full mt-3">
            <div className="flex flex-col items-center">
              <ul className="w-full">
                <li className="p-3 transition rounded-lg duration-300 hover:bg-gray-100 hover:cursor-pointer">
                  Clientes
                </li>
                <li className="p-3 transition rounded-lg duration-300 hover:bg-gray-100 hover:cursor-pointer">
                  Produtos
                </li>
                <li className="p-3 transition rounded-lg duration-300 hover:bg-gray-100 hover:cursor-pointer">
                  Vendas
                </li>
              </ul>
            </div>
            <Separator className="w-full" />
            <SheetFooter>
              <SheetClose asChild>
                <Button className="w-full" variant={"destructive"}>
                  Sair
                </Button>
              </SheetClose>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
