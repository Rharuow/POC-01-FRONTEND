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
import { useOpenCreateClientModalContext } from "../list";
import { GET_CLIENTS } from "@/service/queries/clients";
import { apolloClient } from "@/lib/apollo";
import { CREATE_CLIENT } from "@/service/mutation/client";
import Loading from "./loading";
import { formClientSchema } from "../schemas";
import { IFormClient } from "../client";

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
    register,
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
            </div>

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
                {isLoading ? (
                  <Skeleton className="w-full h-10 rounded-full" />
                ) : (
                  <div className="flex flex-col">
                    <Input
                      label="CPF"
                      inputMode="numeric"
                      {...register("cpf", {
                        onChange: (event) => {
                          setValue("cpf", cpfMask(event.target.value));
                        },
                        onBlur: (event) => {
                          setCpfIsInvalid(!cpfIsValid(event.target.value));
                        },
                      })}
                      className={cn({
                        "border border-red-700":
                          (errors && errors.cpf) || cpfIsInvalid,
                      })}
                    />
                    {((errors && errors.cpf) || cpfIsInvalid) && (
                      <span className="text-xs text-red-400 font-bold">
                        {errors.cpf?.message || "Formato do CPF inválido"}
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
                      {...register("cnpj", {
                        onChange: (event) => {
                          setCnpjIsInvalid(!cnpjIsValid(event.target.value));
                          setValue("cnpj", cnpjMask(event.target.value));
                        },
                        onBlur: (event) => setCnpjIsInvalid(!cnpjIsValid(event.target.value)),
                      })}
                      className={cn({
                        "border border-red-700":
                          (errors && errors.cnpj) || cnpjIsInvalid,
                      })}
                    />
                    {((errors && errors.cnpj) || cnpjIsInvalid) && (
                      <span className="text-xs text-red-400 font-bold">
                        {errors.cnpj?.message ||
                          "Formato do CNPJ inválido"}
                      </span>
                    )}
                  </div>
                )}
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
