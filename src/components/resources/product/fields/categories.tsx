import React from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import { Category } from '../../category/category'
import { Toggle } from '@/components/ui/toggle'
import { IFormProduct } from '../product'

const Categories = ({ categories }: { categories: Array<Category> }) => {

  const { getValues, control, register } = useFormContext<IFormProduct>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: "categories", // unique name for your Field Array
  });


  function handleSelectCategory(category: string) {
    getValues("categories").some(cat => cat.name === category) ?
      remove(fields.findIndex(field => field.name === category)) :
      append({ name: category })
  }

  return (
    <div className="flex flex-col gap-2">
      <p>Categorias</p>
      <div className="flex flex-wrap gap-2">
        {categories.length > 0 && categories.map((category) => (
          <Toggle
            defaultPressed={getValues("categories")?.some(cat => cat.name === category.name)}
            size={"sm"} key={category.name}
            className="border rounded-full"
            onClick={() => handleSelectCategory(String(category.name))}
          >
            {category.name}
          </Toggle>
        ))}
      </div>
      {fields.length > 0 && fields.map((field, index) => (
        <input key={field.id} {...register(`categories.${index}.name`)} readOnly hidden />
      ))}
    </div>
  )
}

export default Categories
