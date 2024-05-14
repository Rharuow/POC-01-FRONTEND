import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { FormCreateClient } from "./form";

export const CreateClient = () => {
  return (
    <DialogContent className="max-w-[425px] md:max-w-[525px] lg:max-w-[825px]">
      <DialogHeader>
        <DialogTitle>Adicionar Cliente</DialogTitle>
      </DialogHeader>
      <FormCreateClient />
      <DialogFooter>
        <Button type="submit">Salvar</Button>
      </DialogFooter>
    </DialogContent>
  );
};
