import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cpfMask } from "@/lib/mask/cpf";
import { cnpjMask } from "@/lib/mask/cnpj";
import { cpfIsValid } from "@/lib/validation/cpf";
import { cnpjIsValid } from "@/lib/validation/cnpj";
import { useMutation } from "@apollo/client";
import { useOpenCreateClientModalContext } from "../list";
import { GET_CLIENTS } from "@/service/queries/clients";
import { apolloClient } from "@/lib/apollo";
import { CREATE_CLIENT } from "@/service/mutation/client";
import Loading from "./loading";
import { formClientSchema } from "../schemas";
import { IFormClient } from "../client";
import InputGroup from "@/components/ui/inputGroup";

export const FormCreateClient = () => {
  const [createClient] = useMutation(CREATE_CLIENT);
  const { setIsOpen } = useOpenCreateClientModalContext();

  const methods = useForm<IFormClient>({
    resolver: zodResolver(formClientSchema),
    defaultValues: {
      cnpj: '',
      cpf: '',
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [typeDocument, setTypeDocument] = useState<"cpf" | "cnpj">("cpf");
  const [cpfIsInvalid, setCpfIsInvalid] = useState(false);
  const [cnpjIsInvalid, setCnpjIsInvalid] = useState(false);

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;

  async function onSubmit(data: IFormClient) {
    try {
      setIsLoading(true);

      await createClient({
        variables: data,
        update: (cache, { data: { createClient } }) => {
          const { clients } = apolloClient.readQuery({ query: GET_CLIENTS });
          cache.writeQuery({
            query: GET_CLIENTS,
            data: {
              clients: [...clients, createClient],
            },
          });
        },
      });
      toast("Cliente criado com sucesso");
      setIsOpen(false);
    } catch (error) {
      console.error(error);
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
                  onClick={() => {
                    setCnpjIsInvalid(false);
                    setTypeDocument("cpf");
                  }}
                >
                  CPF
                </TabsTrigger>
                <TabsTrigger
                  value="cnpj"
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
      </form>
    </FormProvider>
  );
};
