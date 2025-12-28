import React from "react";
import { Circle } from "lucide-react";
import { cn } from "@/utils";

const RadioGroup = React.forwardRef(({ className, children, onValueChange, defaultValue, ...props }, ref) => {
  const [value, setValue] = React.useState(defaultValue);

  return (
    <div className={cn("grid gap-2", className)} {...props} role="radiogroup">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            checked: child.props.value === value,
            onClick: () => {
              setValue(child.props.value);
              if (onValueChange) onValueChange(child.props.value);
            }
          });
        }
        return child;
      })}
    </div>
  );
});
RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = React.forwardRef(({ className, value, checked, onClick, ...props }, ref) => {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onClick}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    >
      <span className={cn("flex items-center justify-center", checked ? "opacity-100" : "opacity-0")}>
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </span>
    </button>
  );
});
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };