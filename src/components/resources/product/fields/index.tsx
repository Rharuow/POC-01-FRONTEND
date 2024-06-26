import InputGroup from '@/components/ui/inputGroup'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { IFormProduct } from '../product'
import TextareaGroup from '@/components/ui/textareaGroup'
import { Category } from '../../category/category'
import { Button } from '@/components/ui/button'
import Categories from './categories'
import { DialogClose } from '@/components/ui/dialog'

const Fields = ({ categories, isLoading }: { categories: Array<Category>; isLoading: boolean }) => {

  const { formState: { errors } } = useFormContext<IFormProduct>()

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 md:grid md:grid-cols-3">
          <InputGroup label="Nome" name="name" />
          <InputGroup label="Valor" name="price" inputMode="numeric" step={0.01} min={0} type="number" />
          <InputGroup label="Estoque" name="inventory_quantity" inputMode="numeric" min={0} step={1} type="number" />
        </div>

        <TextareaGroup name='description' />

        <Categories categories={categories} />
      </div>
      <DialogClose type="submit" className='bg-primary text-white p-2 rounded-lg'
        disabled={
          Object.keys(errors).length !== 0 ||
          isLoading
        }>
        Salvar
      </DialogClose>
    </>
  )
}

export default Fields
