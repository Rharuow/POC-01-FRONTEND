import React from 'react'
import { Input, InputProps, OptionalsProps } from './input'
import { useFormContext } from 'react-hook-form'
import { cn } from '@/lib/utils';

const InputGroup = React.forwardRef<
  HTMLInputElement,
  InputProps & OptionalsProps
>(
  (
    {
      onBlur,
      onChange,
      name,
      ...props
    },
    ref
  ) => {
    const { register, formState: { errors } } = useFormContext()

    return (
      <div className="flex flex-col">
        <Input
          {...register(String(name), {
            ...(onChange && { onChange }),
            ...(onBlur && { onBlur })
          })}
          autoFocus={false}
          className={cn({
            "border border-red-700": errors && errors[String(name)],
          })}
          {...props}
        />
        {errors && errors[String(name)] && (
          <span className="text-xs text-red-400 font-bold">
            {String(errors[String(name)]?.message)}
          </span>
        )}
      </div>
    )
  }
)

InputGroup.displayName = "InputGroup";


export default InputGroup
