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
import { GET_CLIENTS } from "@/service/queries/clients";
import { apolloClient } from "@/lib/apollo";
import { Client } from "../client";
import { UPDATE_CLIENT } from "@/service/mutation/client";

interface IFormUpdateClient {
  name: string;
  email: string;
  documentation: string;
  billing: string;
  delivery: string;
}

type ClientUpdateInput = {
  data: {
    address: {
      update: {
        data: {
          billing: { set: string; }
          delivery: { set: string; }
        },
      };
    };
    document: {
      update: {
        data: {
          cnpj?: { set: string; }
          cpf?: { set: string; }
        },
      };
    };
    email: { set: string; }
    name: { set: string; }
  };
  where: {
    id: string
  }
};

const schema = z.object({
  name: z.string().min(4, { message: "Pelo menos 4 caracteres" }),
  documentation: z.string().min(1, { message: "Documento inválido" }),
  email: z
    .string({ required_error: "O email é obrigatório" })
    .email("Este é um email inválido."),
  billing: z.string().min(1, { message: "Endereço de cobrança inválido" }),
  delivery: z.string().min(1, { message: "Endereço de entrega inválido" }),
});

export const FormUpdateClient = ({ setEditModalIsOpen, client }: { setEditModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>; client: Client }) => {
  const [updateOneClient] = useMutation(UPDATE_CLIENT);

  const methods = useForm<IFormUpdateClient>({
    resolver: zodResolver(schema),
    defaultValues: {
      billing: client.address?.billing,
      delivery: client.address?.delivery,
      documentation: client.document?.cnpj || client.document?.cpf,
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

  async function onSubmit(data: IFormUpdateClient) {
    try {
      setIsLoading(true);
      const { documentation, billing, delivery, email, name } = data;
      const formattedData: ClientUpdateInput = {
        data: {
          email: { set: email },
          name: { set: name },
          document: {
            update: {
              data: {
                ...(typeDocument === "cnpj"
                  ? { cnpj: { set: documentation } }
                  : { cpf: { set: documentation } }),
              }
            },
          },
          address: {
            update: {
              data: {
                billing: { set: billing },
                delivery: { set: delivery },
              }
            },
          },
        },
        where: {
          id: String(client.id)
        }
      };

      await updateOneClient({
        variables: formattedData,
        update: (cache, { data: { updateOneClient } }) => {
          const { clients } = apolloClient.readQuery({ query: GET_CLIENTS });

          cache.writeQuery({
            query: GET_CLIENTS,
            data: {
              clients: [...clients.filter((clt: Client) => clt.id !== client.id), updateOneClient],
            },
          });
        },
      });
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
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 md:grid md:grid-cols-2">
          {isLoading ? (
            <Skeleton className="w-full h-10 rounded-full" />
          ) : (
            <div className="flex flex-col">
              <Input
                label="Nome"
                {...register("name")}
                autoFocus={false}
                className={cn({
                  "border border-red-700": errors && errors.name,
                })}
              />
              {errors && errors.name && (
                <span className="text-xs text-red-400 font-bold">
                  {errors.name.message}
                </span>
              )}
            </div>
          )}
          {isLoading ? (
            <Skeleton className="w-full h-10 rounded-full" />
          ) : (
            <div className="flex flex-col">
              <Input
                label="Email"
                {...register("email")}
                className={cn({
                  "border border-red-700": errors && errors.email,
                })}
              />
              {errors && errors.email && (
                <span className="text-xs text-red-400 font-bold">
                  {errors.email.message}
                </span>
              )}
            </div>
          )}
        </div>
        {isLoading ? (
          <Skeleton className="w-full h-10 rounded-full" />
        ) : (
          <div className="flex flex-col">
            <Input
              label="Endreço de cobrança"
              {...register("billing")}
              className={cn({
                "border border-red-700": errors && errors.billing,
              })}
            />
            {errors && errors.billing && (
              <span className="text-xs text-red-400 font-bold">
                {errors.billing.message}
              </span>
            )}
          </div>
        )}
        {isLoading ? (
          <Skeleton className="w-full h-10 rounded-full" />
        ) : (
          <div className="flex flex-col">
            <Input
              label="Endreço de entrega"
              {...register("delivery")}
              className={cn({
                "border border-red-700": errors && errors.delivery,
              })}
            />
            {errors && errors.delivery && (
              <span className="text-xs text-red-400 font-bold">
                {errors.delivery.message}
              </span>
            )}
          </div>
        )}

        <Tabs defaultValue={typeDocument}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="cpf"
              disabled={isLoading}
              onClick={() => {
                setValue("documentation", "");
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
                setValue("documentation", "");
                setCpfIsInvalid(false);
                setTypeDocument("cnpj");
              }}
            >
              CNPJ
            </TabsTrigger>
          </TabsList>
          <TabsContent value="cpf">
            {isLoading ? (
              <Skeleton className="w-full h-10 rounded-full" />
            ) : (
              <div className="flex flex-col">
                <Input
                  label="CPF"
                  inputMode="numeric"
                  {...register("documentation", {
                    onChange: (event) => {
                      setValue("documentation", cpfMask(event.target.value));
                    },
                    onBlur: (event) => {
                      setCpfIsInvalid(!cpfIsValid(event.target.value));
                    },
                  })}
                  className={cn({
                    "border border-red-700":
                      (errors && errors.documentation) || cpfIsInvalid,
                  })}
                />
                {((errors && errors.documentation) || cpfIsInvalid) && (
                  <span className="text-xs text-red-400 font-bold">
                    {errors.documentation?.message || "Formato do CPF inválido"}
                  </span>
                )}
              </div>
            )}
          </TabsContent>
          <TabsContent value="cnpj">
            {isLoading ? (
              <Skeleton className="w-full h-10 rounded-full" />
            ) : (
              <div className="flex flex-col">
                <Input
                  label="CNPJ"
                  inputMode="numeric"
                  {...register("documentation", {
                    onChange: (event) => {
                      setCnpjIsInvalid(!cnpjIsValid(event.target.value));
                      setValue("documentation", cnpjMask(event.target.value));
                    },
                    onBlur: (event) => {
                      console.log(cnpjIsValid(event.target.value));
                      setCnpjIsInvalid(!cnpjIsValid(event.target.value));
                    },
                  })}
                  className={cn({
                    "border border-red-700":
                      (errors && errors.documentation) || cnpjIsInvalid,
                  })}
                />
                {((errors && errors.documentation) || cnpjIsInvalid) && (
                  <span className="text-xs text-red-400 font-bold">
                    {errors.documentation?.message ||
                      "Formato do CNPJ inválido"}
                  </span>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

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
