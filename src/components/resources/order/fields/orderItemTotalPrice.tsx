import InputGroup from '@/components/ui/inputGroup'
import React from 'react'

const TotalPrice = ({ index }: { index: number }) => {
  return (
    <InputGroup
      label="Valor total"
      inputMode="numeric"
      readOnly
      type="number"
      name={`orderItems.${index}.totalPrice`}
    />
  )
}

export default TotalPrice
