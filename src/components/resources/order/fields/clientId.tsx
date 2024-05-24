import InputSelectGroup, { Items } from '@/components/ui/selectGroup'
import React from 'react'
import { handleSelectClient } from '../utils/form/handleSelectClient'
import { Client } from '../../client/client'
import { Product } from '../../product/product'
import { FieldArrayWithId, UseFieldArrayAppend, useFieldArray, useFormContext } from 'react-hook-form'
import { IFormOrder } from '../order'

const ClientIdField = ({
  clients,
  products,
  append,
  fields
}: {
  clients: Array<Client>;
  products: Array<Product>;
  append: UseFieldArrayAppend<IFormOrder, "orderItems">;
  fields: Array<FieldArrayWithId<IFormOrder, "orderItems", "id">>
}) => {
  const { setValue } = useFormContext<IFormOrder>()

  return (
    <InputSelectGroup
      items={clients.map(client => ({ label: String(client.name), value: String(client.id) })) as Items}
      name="clientId"
      onChange={() => {
        handleSelectClient({
          append,
          setValue,
          fields,
          product: products[0] as Product
        })
      }}
      label="Clientes"
      placeholder="Selecione um cliente"
    />
  )
}

export default ClientIdField
