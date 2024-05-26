import React from 'react'
import { Input, InputProps, OptionalsProps } from './input'
import { useFormContext } from 'react-hook-form'
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

const InputGroup = React.forwardRef<
  HTMLInputElement,
  InputProps & OptionalsProps
>(
  (
    {
      onBlur,
      onChange,
      name,
      tooltip,
      ...props
    },
    ref
  ) => {
    const { register, formState: { errors } } = useFormContext()

    return (
      <div className="flex flex-col">
        {tooltip ?
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <>
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
                </>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider> :
          <>
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
          </>
        }
      </div>
    )
  }
)

InputGroup.displayName = "InputGroup";


export default InputGroup
