import React from 'react'

import InputGroup from '@/components/ui/inputGroup'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import Fields from './fields'

const Billing = () => {

  return (
    <Popover>
      <PopoverTrigger>
        <InputGroup label="Endereço de cobrança" name="billing" readOnly />
      </PopoverTrigger>
      <Fields fieldName='billing' />
    </Popover>
  )
}

export default Billing
