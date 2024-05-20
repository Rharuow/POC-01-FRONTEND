import React from 'react'
import { Input } from './input'
import { useFormContext } from 'react-hook-form'
import { cn } from '@/lib/utils';

const InputGroup = ({
  label,
  name,
  onChange,
  onBlur
}: {
  label: string;
  name: string;
  onChange?: (event: any) => void;
  onBlur?: (event: any) => void
}) => {

  const { register, formState: { errors } } = useFormContext()

  return (
    <div className="flex flex-col">
      <Input
        label={label}
        {...register(name, {
          ...(onChange && { onChange }),
          ...(onBlur && { onBlur })
        })}
        autoFocus={false}
        className={cn({
          "border border-red-700": errors && errors[name],
        })}
      />
      {errors && errors[name] && (
        <span className="text-xs text-red-400 font-bold">
          {String(errors[name]?.message)}
        </span>
      )}
    </div>
  )
}

export default InputGroup
