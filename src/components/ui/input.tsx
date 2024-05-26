import * as React from "react";

import { cn } from "@/lib/utils";
import { useFormContext, useWatch } from "react-hook-form";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { }

export type OptionalsProps = {
  label?: string;
  Icon?: React.ElementType;
  iconClassName?: string;
  containerClassName?: string;
  iconAction?: React.MouseEventHandler<HTMLDivElement>;
  dark?: boolean;
  tooltip?: string
}

const Input = React.forwardRef<
  HTMLInputElement,
  InputProps & OptionalsProps
>(
  (
    {
      className,
      type,
      label,
      onFocus,
      onBlur,
      Icon,
      iconClassName,
      iconAction,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = React.useState(false);

    const { control } = useFormContext();

    const valueWatch = useWatch({ control, name: String(props.name) });

    return (
      <div className={cn("relative", containerClassName)}>
        <input
          id={props.id || props.name}
          type={type}
          className={cn(
            "flex h-10 w-full border z-10 border-input rounded-full bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          onFocus={(event) => {
            setFocused(true);
            onFocus && onFocus(event);
          }}
          onBlur={(event) => {
            setFocused(!!event.target.value);
            onBlur && onBlur(event);
          }}
          ref={ref}
          {...props}
        />
        {label && (
          <label
            className={cn(
              "text-gray-500  absolute top-1/2 -translate-y-1/2 left-3",
              {
                "animate-label-focus": focused || valueWatch,
                "animate-label-blur": !focused,
              }
            )}
            htmlFor={props.id || props.name}
          >
            {label}
          </label>
        )}
        {Icon && (
          <div
            className={cn(
              "text-white absolute top-1/2 -translate-y-1/2 right-3",
              iconClassName
            )}
            onClick={iconAction}
          >
            <Icon />
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
