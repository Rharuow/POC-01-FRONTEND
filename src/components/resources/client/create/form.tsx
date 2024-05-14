import { Input } from "@/components/ui/input";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";

interface IFormCreateClient {
  name: string;
  email: string;
  kindOfDocumentation: "CPF" | "CNPJ";
  cpf: string;
  cnpj: string;
  billing: string;
  delivery: string;
}

export const FormCreateClient = () => {
  const methods = useForm<IFormCreateClient>();

  const { handleSubmit } = methods;

  const onSubmit = (data: IFormCreateClient) => {
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 md:grid md:grid-cols-2">
          <Input label="Nome" name="name" />
          <Input label="Email" name="email" />
        </div>
        <Input label="Endreço de cobrança" name="billing" />
        <Input label="Endreço de entrega" name="delivery" />
      </form>
    </FormProvider>
  );
};
