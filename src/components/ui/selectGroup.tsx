import React from 'react'
import { FormField, FormItem, FormMessage } from './form'
import { useFormContext } from 'react-hook-form'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./select";

import { cn } from '@/lib/utils'

export type Item = { value: string; label: string }
export type Items = Array<Item>

const InputSelectGroup = ({
  onChange,
  placeholder,
  items,
  label,
  name
}: {
  onChange: (e: string) => void;
  placeholder: string;
  label: string;
  items: Items;
  name: string
}) => {

  const { control, formState: { errors } } = useFormContext()

  return (
    <div className="flex flex-col">
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <Select onValueChange={(e) => {
              field.onChange(e)
              onChange(e)
            }} defaultValue={field.value}>
              <SelectTrigger className={cn({
                "border border-red-700": errors && errors[name]
              })}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{label}</SelectLabel>
                  {items.map(item => (
                    <SelectItem value={String(item.value)} key={item.value}>{item.label}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
    </div>
  )
}

export default InputSelectGroup
