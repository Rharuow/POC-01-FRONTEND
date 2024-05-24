import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useMutation } from "@apollo/client";
import { useOpenCreateClientModalContext } from "../list";
import { GET_CLIENTS } from "@/service/queries/clients";
import { apolloClient } from "@/lib/apollo";
import { CREATE_CLIENT } from "@/service/mutation/client";
import Loading from "./loading";
import { formClientSchema } from "../schemas";
import { IFormClient } from "../client";
import Fields from "../fields";

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

  const {
    handleSubmit,
  } = methods;

  async function onSubmit(data: IFormClient) {
    try {
      setIsLoading(true);

      await createClient({
        variables: data,
        update: (cache, { data: { createClient } }) => {
          const data = apolloClient.readQuery({ query: GET_CLIENTS });
          cache.writeQuery({
            query: GET_CLIENTS,
            data: {
              getClients: [...data.getClients, createClient],
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
          isLoading ? <Loading /> :
            <Fields isLoading={isLoading} />
        }
      </form>
    </FormProvider>
  );
};
