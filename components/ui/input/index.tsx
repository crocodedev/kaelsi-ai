import { InputHTMLAttributes, forwardRef } from "react";
import { Icon, ICONS } from "@/components/ui/icon/Icon";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: keyof typeof ICONS;
  iconPosition?: 'left' | 'right';
  validation?: 'Date' | 'Time' | 'Place';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, icon, iconPosition = 'right', validation, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label className="text-white text-sm font-medium">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            className={cn(
              "w-full h-12 px-4 rounded-xl gradient-dark-section border  text-white ",
              icon && iconPosition === 'left' && "pl-12",
              icon && iconPosition === 'right' && "pr-12",
              className
            )}
            ref={ref}
            {...props}
          />
          {icon && (
            <div className={cn(
              "absolute top-1/2 transform -translate-y-1/2",
              iconPosition === 'left' ? "left-4" : "right-4"
            )}>
              <Icon name={icon} width={16} height={16} />
            </div>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";
