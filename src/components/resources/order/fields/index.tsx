import React from 'react'

import { useFieldArray, useFormContext } from 'react-hook-form'
import { formatCurrency } from '@/utils/currencyConverter'
import { Button } from '@/components/ui/button'
import { handleTotalPrice } from '../utils/form/handleTotalPrice'
import { isLast } from '../utils/form/isLast'
import { handleRemove } from '../utils/form/removeField'
import { handleAppend } from '../utils/form/appendField'
import { MinusCircle, PlusCircle } from 'lucide-react'
import { Client } from '../../client/client'
import { Product } from '../../product/product'
import { IFormOrder } from '../order'
import ClientIdField from './clientId'
import ProductIdField from './orderItemProductId'
import AmountField from './orderItemAmount'
import TotalPrice from './orderItemTotalPrice'

const Fields = ({
  clients,
  products,
}: {
  clients: Array<Client>;
  products: Array<Product>;
}) => {

  const { control, setValue, watch } = useFormContext<IFormOrder>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: "orderItems", // unique name for your Field Array
  });

  return (
    <div className="flex flex-col gap-4">
      <ClientIdField clients={clients} products={products} append={append} fields={fields} />
      {
        fields.map((field, index) => (
          <div className="grid grid-cols-5 gap-2" key={field.id}>
            <div className="col-span-2">
              <ProductIdField index={index} products={products} />
            </div>
            <AmountField index={index} products={products} />
            <TotalPrice index={index} />
            <Button
              type="button"
              className="rounded-full"
              variant={"outline"}
              onClick={() => {
                if (!isLast({ position: index, length: fields.length })) handleRemove({ index, remove })
                else handleAppend(append, {
                  amount: watch(`orderItems.${index}.amount`),
                  productId: watch(`orderItems.${index}.productId`),
                  totalPrice: watch(`orderItems.${index}.totalPrice`),
                })
                handleTotalPrice({ setValue, watch })
              }}
            >
              {!isLast({ position: index, length: fields.length }) ? <MinusCircle /> : <PlusCircle />}
            </Button>
          </div>
        ))}
      {watch("totalPrice") && <p>Total: {formatCurrency(Number(watch("totalPrice")))}</p>}
    </div>
  )
}

export default Fields
