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
import { Client, IFormClient } from "../client";
import { UPDATE_CLIENT } from "@/service/mutation/client";
import { formClientSchema } from "../schemas";
import Loading from "./loading";
import InputGroup from "@/components/ui/inputGroup";
import { apolloClient } from "@/lib/apollo";
import { GET_CLIENTS } from "@/service/queries/clients";
import Fields from "../fields";

export const FormUpdateClient = ({ setEditModalIsOpen, client }: { setEditModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>; client: Client }) => {
  const [updateClient] = useMutation(UPDATE_CLIENT);

  const methods = useForm<IFormClient>({
    resolver: zodResolver(formClientSchema),
    defaultValues: {
      billing: client.address?.billing,
      delivery: client.address?.delivery,
      cnpj: client.document?.cnpj ? client.document?.cnpj : "",
      cpf: client.document?.cpf ? client.document?.cpf : "",
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

      await updateClient({
        variables: { ...data, id: client.id },
        update: (cache, { data: { updateClient } }) => {
          const { getClients } = apolloClient.readQuery({ query: GET_CLIENTS });
          cache.writeQuery({
            query: GET_CLIENTS,
            data: {
              getClients: [...getClients.filter((clt: Client) => clt.id !== client.id), updateClient],
            },
          });
        },
      })

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
          isLoading ? <Loading /> :
            <Fields isLoading={isLoading} />
        }
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
