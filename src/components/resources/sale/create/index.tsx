import React from "react";
import { X } from "lucide-react";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const CreateSale = () => {
  const { setIsOpen } = useOpenCreateSaleModalContext();
  return (
    <DialogContent
      className="max-w-[425px] md:max-w-[525px] lg:max-w-[825px]"
      withoutCloseButton
    >
      <div className="absolute right-4 top-4" onClick={() => setIsOpen(false)}>
        <X />
      </div>
      <DialogHeader>
        <DialogTitle>Adicionar Venda</DialogTitle>
      </DialogHeader>
      <FormCreateSale />
    </DialogContent>
  );
};
