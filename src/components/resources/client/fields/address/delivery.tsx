import React from 'react'

import InputGroup from '@/components/ui/inputGroup'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import Fields from './fields'


const Delivery = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <InputGroup label="Endreço de entrega" name="delivery" readOnly />
      </PopoverTrigger>
      <Fields fieldName='delivery' />
    </Popover>
  )
}

export default Delivery
