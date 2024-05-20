import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cpfMask } from "@/lib/mask/cpf";
import { cnpjMask } from "@/lib/mask/cnpj";
import { cpfIsValid } from "@/lib/validation/cpf";
import { cn } from "@/lib/utils";
import { cnpjIsValid } from "@/lib/validation/cnpj";
import { useMutation } from "@apollo/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Client, IFormClient } from "../client";
import { UPDATE_CLIENT } from "@/service/mutation/client";
import { formClientSchema } from "../schemas";
import Loading from "./loading";
import InputGroup from "@/components/ui/inputGroup";

export const FormUpdateClient = ({ setEditModalIsOpen, client }: { setEditModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>; client: Client }) => {
  const [updateOneClient] = useMutation(UPDATE_CLIENT);

  const methods = useForm<IFormClient>({
    resolver: zodResolver(formClientSchema),
    defaultValues: {
      billing: client.address?.billing,
      delivery: client.address?.delivery,
      cnpj: client.document?.cnpj,
      cpf: client.document?.cpf,
      email: client.email,
      name: client.name
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [typeDocument, setTypeDocument] = useState<"cpf" | "cnpj">(client.document?.cnpj ? "cnpj" : "cpf");
  const [cpfIsInvalid, setCpfIsInvalid] = useState(false);
  const [cnpjIsInvalid, setCnpjIsInvalid] = useState(false);

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = methods;

  async function onSubmit(data: IFormClient) {
    try {
      setIsLoading(true);

      toast("Cliente atualizado com sucesso");
      setEditModalIsOpen(false);
    } catch (error) {
      console.log(error);
      toast("Desculpe, algo está errado!");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {
          isLoading ? <Loading /> : <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2 md:grid md:grid-cols-2">

              <InputGroup label="Nome" name="name" />

              <InputGroup label="Email" name="email" />

            </div>

            <InputGroup label="Endereço  de cobrança" name="billing" />

            <InputGroup label="Endreço de entrega" name="delivery" />

            <Tabs defaultValue={typeDocument}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="cpf"
                  disabled={isLoading}
                  onClick={() => {
                    setCnpjIsInvalid(false);
                    setTypeDocument("cpf");
                  }}
                >
                  CPF
                </TabsTrigger>
                <TabsTrigger
                  value="cnpj"
                  disabled={isLoading}
                  onClick={() => {
                    setCpfIsInvalid(false);
                    setTypeDocument("cnpj");
                  }}
                >
                  CNPJ
                </TabsTrigger>
              </TabsList>
              <TabsContent value="cpf">
                <InputGroup
                  label="CPF"
                  name="cpf"
                  onChange={(event) => setValue("cpf", cpfMask(event.target.value))}
                  onBlur={(event) => setCpfIsInvalid(!cpfIsValid(event.target.value))}
                />
              </TabsContent>
              <TabsContent value="cnpj">
                <InputGroup
                  label="CNPJ"
                  name="cnpj"
                  onChange={(event) => {
                    setCnpjIsInvalid(!cnpjIsValid(event.target.value));
                    setValue("cnpj", cnpjMask(event.target.value));
                  }}
                  onBlur={(event) => setCnpjIsInvalid(!cnpjIsValid(event.target.value))}
                />
              </TabsContent>
            </Tabs>
          </div>
        }

        <Button
          type="submit"
          disabled={
            Object.keys(errors).length !== 0 ||
            cnpjIsInvalid ||
            cpfIsInvalid ||
            isLoading
          }
        >
          Salvar
        </Button>
        <Button
          type="button"
          variant={"outline"}
          onClick={() => setEditModalIsOpen(false)}
        >
          Cancelar
        </Button>

      </form>
    </FormProvider>
  );
};
