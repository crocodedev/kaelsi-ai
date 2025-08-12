"use client"

import { useState, useRef, useEffect } from "react";
import { Icon } from "@/components/ui/icon/Icon";
import { cn } from "@/lib/utils";

interface DateInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export function DateInput({ label, placeholder = "dd/mm/yyyy", value, onChange, className, disabled }: DateInputProps) {
  const [displayValue, setDisplayValue] = useState(value || "");
  const inputRef = useRef<HTMLInputElement>(null);

  const formatDate = (input: string) => {
    const numbers = input.replace(/\D/g, "");
    
    const limited = numbers.slice(0, 8);
    
    let formatted = "";
    for (let i = 0; i < limited.length; i++) {
      if (i === 2 || i === 4) {
        formatted += "/";
      }
      formatted += limited[i];
    }
    
    return formatted;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formatted = formatDate(input);
    setDisplayValue(formatted);
    
    if (onChange) {
      onChange(formatted);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    const isNumber = /[0-9]/.test(e.key);
    
    if (!isNumber && !allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (value !== undefined) {
      setDisplayValue(value);
    }
  }, [value]);

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-white text-sm font-medium">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          disabled={disabled}
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "w-full h-12 px-4 pr-12 rounded-xl gradient-dark-section border text-white placeholder:text-white/50 focus:outline-none focus:border-white/20 transition-colors",
            className
          )}
        />
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
          <Icon name="calendar" width={16} height={16} />
        </div>
      </div>
    </div>
  );
} 