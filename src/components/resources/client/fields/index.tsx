import InputGroup from '@/components/ui/inputGroup';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form';
import { IFormClient } from '../client';
import { cpfMask } from '@/lib/mask/cpf';
import { cpfIsValid } from '@/lib/validation/cpf';
import { cnpjIsValid } from '@/lib/validation/cnpj';
import { cnpjMask } from '@/lib/mask/cnpj';
import { Button } from '@/components/ui/button';
import Billing from './address/billing';
import Delivery from './address/delivery';

const Fields = ({ isLoading }: { isLoading: boolean }) => {

  const { setValue } = useFormContext<IFormClient>()

  const [typeDocument, setTypeDocument] = useState<"cpf" | "cnpj">("cpf");
  const [cpfIsInvalid, setCpfIsInvalid] = useState(false);
  const [cnpjIsInvalid, setCnpjIsInvalid] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 md:grid md:grid-cols-2">
          <InputGroup label="Nome" name="name" />
          <InputGroup label="Email" name="email" />
        </div>
        <Billing />
        <Delivery />
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
      <Button
        type="submit"
        disabled={
          cnpjIsInvalid ||
          cpfIsInvalid ||
          isLoading
        }
      >
        Salvar
      </Button>
    </>
  )
}

export default Fields
