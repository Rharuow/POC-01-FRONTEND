import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useMutation } from "@apollo/client";
import { GET_CLIENTS } from "@/service/queries/clients";
import { apolloClient } from "@/lib/apollo";
import { CREATE_CLIENT } from "@/service/mutation/client";
import Loading from "./loading";
import { formClientSchema } from "../schemas";
import { IFormClient } from "../client";
import Fields from "../fields";
import { useAccordionContext } from "@/pages";

export const FormCreateClient = () => {
  const [createClient] = useMutation(CREATE_CLIENT);

  const { setAccordionValue } = useAccordionContext()

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
      setAccordionValue("")
      await createClient({
        variables: data,
        ...(process.env.NODE_ENV !== 'test' && {
          update: (cache, { data: { createClient } }) => {
            const data = apolloClient.readQuery({ query: GET_CLIENTS });
            cache.writeQuery({
              query: GET_CLIENTS,
              data: {
                getClients: [...data.getClients, createClient],
              },
            });
          },
        })
      });
      setAccordionValue("clients")
      toast("Cliente criado com sucesso");
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
