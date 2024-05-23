import InputSelectGroup, { Items } from '@/components/ui/selectGroup'
import React from 'react'
import { Product } from '../../product/product'
import { formatCurrency } from '@/utils/currencyConverter'
import { handleOrderAmount } from '../utils/form/handleOrderAmount'
import { useFormContext } from 'react-hook-form'
import { IFormOrder } from '../order'
import { handleTotalPrice } from '../utils/form/handleTotalPrice'

const ProductIdField = ({ products, index }: { products: Array<Product>; index: number }) => {

  const { watch, setValue } = useFormContext<IFormOrder>()

  return (
    <InputSelectGroup
      items={products
        .map(product => ({
          label: `${String(product.name)} (${formatCurrency(Number(product.price))})`,
          value: String(product.id)
        })) as Items
      }
      name={`orderItems.${index}.productId`}
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
      label="Produtos"
      placeholder="Selecione um produto"
    />
  )
}

export default ProductIdField
