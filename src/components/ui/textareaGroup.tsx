import React from 'react'
import { OptionalsProps } from './input'
import { useFormContext } from 'react-hook-form'
import { cn } from '@/lib/utils';
import { Textarea, TextareaProps } from './textarea';

const TextareaGroup = React.forwardRef<
  HTMLInputElement,
  TextareaProps & OptionalsProps
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
        <Textarea
          label="Descrição"
          {...register(String(name), {
            ...(onChange && { onChange }),
            ...(onBlur && { onBlur })
          })}
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

TextareaGroup.displayName = "TextareaGroup";


export default TextareaGroup
