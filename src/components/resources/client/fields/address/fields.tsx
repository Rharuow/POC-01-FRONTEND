import React, { useEffect } from 'react'

import InputGroup from '@/components/ui/inputGroup'
import { useFormContext } from 'react-hook-form'
import { viacepAPI } from '@/service/viacep'
import { applyCEPMask } from '@/lib/mask/cep'
import { IFormClient } from '../../client'
import TextareaGroup from '@/components/ui/textareaGroup'
import { PopoverClose, PopoverContent } from '@/components/ui/popover'

type FieldsAdress = 'zipCode' | 'neighborhood' | 'state' | 'city' | 'number' | 'street'

type FieldName = 'billing' | 'delivery'

const Fields = ({ fieldName }: { fieldName: FieldName }) => {
  const fieldsRequired: Array<FieldsAdress> = ['zipCode', 'neighborhood', 'state', 'city', 'number', 'street']

  const { setValue, watch, getValues } = useFormContext<IFormClient>()

  function concatAddress() {
    return `${getValues("number")}, ${getValues("zipCode")} - ${getValues("street")}, ${getValues("neighborhood")} - ${getValues("city")}, ${getValues("state")} ${getValues("complement") ? `Complemento: ${getValues("complement")}` : ''}`
  }

  function splitAddress() {
    const [number, ...rest] = getValues(fieldName).split(", ")
    const [zipCode, street] = rest[0].split(" - ")
    const [neighborhood, city] = rest[1].split(" - ")
    const [state] = rest[2].split(" ")
    const address = {
      zipCode,
      number,
      street,
      neighborhood,
      city,
      state,
      complement: getValues("complement")
    }
    return address
  }

  async function onChangeCEP(value: string) {
    setValue("zipCode", value)
    if (value.length === 9) {
      const { data } = await viacepAPI.get(`${value}/json`)
      if (data.error) return
      setValue("state", data.uf)
      setValue("city", data.localidade)
      setValue("neighborhood", data.bairro)
      setValue("street", data.logradouro)
    }
  }

  const addressIsValid = () => fieldsRequired.some((field) => watch(field) === '')

  function cleanFields() {
    fieldsRequired.forEach((field) => {
      setValue(field, '')
    })
  }

  function handleSaveAddress() {
    setValue(fieldName, concatAddress())
    cleanFields()
  }

  function handleSetValues() {
    if (getValues(fieldName)) {
      const address = splitAddress()
      setValue("zipCode", address.zipCode)
      setValue("number", address.number)
      setValue("street", address.street)
      setValue("neighborhood", address.neighborhood)
      setValue("city", address.city)
      setValue("state", address.state)
      setValue("complement", address.complement)
    }
  }

  return (
    <PopoverContent className='w-[90%] mx-auto bg-gray-900 border-none shadow-lg' onSelect={() => handleSetValues()}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-2">
            <InputGroup
              className='bg-white'
              label='CEP'
              name='zipCode'
              maxLength={9}
              onChange={async (e) => await onChangeCEP(applyCEPMask(e.target.value))}
              {...(getValues("zipCode") && { defaultValue: getValues("zipCode") })}
            />
            <InputGroup className='bg-white' label='Número' name='number' />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <InputGroup className='bg-white' label='Estado' name='state' tooltip='Digeite o CEP' title='Digeite o CEP' readOnly disabled />
            <InputGroup className='bg-white' label='Cidade' name='city' tooltip='Digeite o CEP' title='Digeite o CEP' readOnly disabled />
            <InputGroup className='bg-white' label='Bairro' name='neighborhood' tooltip='Digeite o CEP' title='Digeite o CEP' readOnly disabled />
            <InputGroup className='bg-white' label='Logradouro' name='street' tooltip='Digeite o CEP' title='Digeite o CEP' readOnly disabled />
          </div>
          <div className="grid grid-cols-2 gap-2">
          </div>
          <TextareaGroup className='bg-white' label='Complemento' name='complement' />
        </div>
        <div className="flex justify-around gap-4">
          <PopoverClose className='grow py-2 hover:cursor-pointer bg-white disabled:pointer-events-none disabled:opacity-50 rounded-lg' disabled={addressIsValid()} onClick={() => handleSaveAddress()}>
            Salvar
          </PopoverClose>
          <PopoverClose
            className='grow py-2 text-white bg-transparent rounded-lg border border-white'
            onClick={() => cleanFields()}
          >
            Fechar
          </PopoverClose>
        </div>

      </div>
    </PopoverContent>

  )
}

export default Fields
