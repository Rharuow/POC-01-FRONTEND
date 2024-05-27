import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { createContext, useContext, useState } from "react";
import { FormCreateClient } from "./form";
import { PlusCircle, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Client } from "../client";

export const CreateClient = ({ clients }: { clients?: Array<Client> }) => {

  return (
    <Dialog>
      <DialogTrigger
        asChild
      >
        <Card
          className={cn(
            "h-full w-full bg-transparent text-white border-dashed hover:cursor-pointer p-0",
            {
              "min-h-20": clients && clients.length === 0,
            }
          )}
        >
          <CardContent className="flex flex-col gap-4 justify-center items-center p-4">
            <PlusCircle />
            {clients && clients.length === 0 ? (
              <p>Nenhum cliente Cadastrado</p>
            ) : (
              <p>Adicionar Cliente</p>
            )}
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent
        className="max-w-[425px] md:max-w-[525px] lg:max-w-[825px]"
      >
        <DialogHeader>
          <DialogTitle>Adicionar Cliente</DialogTitle>
        </DialogHeader>
        <FormCreateClient />
      </DialogContent>
    </Dialog>
  );
};
