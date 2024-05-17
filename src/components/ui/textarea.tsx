import * as React from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaProps & {
    label?: string;
  }
>(({ className, label, onFocus, onBlur, ...props }, ref) => {
  const [focused, setFocused] = React.useState(false);

  const {
    control,
    formState: { errors },
  } = useFormContext();

  const valueWatch = useWatch({ control, name: String(props.name) });

  return (
    <div className="relative">
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
          {
            "border-red-700": errors,
          }
        )}
        ref={ref}
        onFocus={(event) => {
          setFocused(true);
          onFocus && onFocus(event);
        }}
        onBlur={(event) => {
          setFocused(!!event.target.value);
          onBlur && onBlur(event);
        }}
        {...props}
      />
      {label && (
        <label
          className={cn("text-gray-500 absolute top-1/2 -translate-y-1/2 left-3", {
            "animate-label-focus": focused || valueWatch,
            "animate-label-blur": !focused,
          })}
          htmlFor={props.id || props.name}
        >
          {label}
        </label>
      )}
    </div>
  );
});
Textarea.displayName = "Textarea";

export { Textarea };