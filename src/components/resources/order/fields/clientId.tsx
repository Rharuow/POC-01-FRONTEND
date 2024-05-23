import InputSelectGroup, { Items } from '@/components/ui/selectGroup'
import React from 'react'
import { handleSelectClient } from '../utils/form/handleSelectClient'
import { Client } from '../../client/client'
import { Product } from '../../product/product'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { IFormOrder } from '../order'

const ClientIdField = ({ clients, products }: { clients: Array<Client>; products: Array<Product> }) => {
  const { control, setValue } = useFormContext<IFormOrder>()
  const { append, fields } = useFieldArray({
    control,
    name: 'orderItems'
  })
  return (
    <InputSelectGroup
      items={clients.map(client => ({ label: String(client.name), value: String(client.id) })) as Items}
      name="clientId"
      onChange={(e: string) => handleSelectClient({
        append,
        setValue,
        fields,
        product: products[0] as Product
      })}
      label="Clientes"
      placeholder="Selecione um cliente"
    />
  )
}

export default ClientIdField
