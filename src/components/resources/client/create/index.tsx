import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { FormCreateClient } from "./form";
import { X } from "lucide-react";
import { useOpenCreateClientModalContext } from "../list";

export const CreateClient = () => {
  const { setIsOpen } = useOpenCreateClientModalContext();
  return (
    <DialogContent
      className="max-w-[425px] md:max-w-[525px] lg:max-w-[825px]"
      withoutCloseButton
    >
      <div className="absolute right-4 top-4" onClick={() => setIsOpen(false)}>
        <X />
      </div>
      <DialogHeader>
        <DialogTitle>Adicionar Cliente</DialogTitle>
      </DialogHeader>
      <FormCreateClient />
    </DialogContent>
  );
};
