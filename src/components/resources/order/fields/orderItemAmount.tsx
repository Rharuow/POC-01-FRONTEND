import InputGroup from '@/components/ui/inputGroup'
import React from 'react'
import { useFormContext } from 'react-hook-form';
import { IFormOrder } from '../order';
import { Product } from '../../product/product';
import { handleOrderAmount } from '../utils/form/handleOrderAmount';
import { handleTotalPrice } from '../utils/form/handleTotalPrice';

const AmountField = ({ index, products }: { index: number; products: Array<Product> }) => {
  const { watch, setValue } = useFormContext<IFormOrder>()
  return (
    <InputGroup
      name={`orderItems.${index}.amount`}
      disabled={!watch(`orderItems.${index}.productId`)}
      label="Quantidade"
      inputMode="numeric"
      type="number"
      min={1}
      onChange={() => {
        handleOrderAmount({
          amount: watch(`orderItems.${index}.amount`),
          index,
          productId: watch(`orderItems.${index}.productId`),
          products: products,
          setValue,
        })
        handleTotalPrice({ setValue, watch })
      }}
    />
  )
}

export default AmountField
