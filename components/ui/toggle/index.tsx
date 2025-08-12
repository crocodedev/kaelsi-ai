"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface ToggleProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export function Toggle({ checked = false, onChange, disabled = false, className }: ToggleProps) {
  const [isChecked, setIsChecked] = useState(checked)

  const handleToggle = () => {
    if (disabled) return
    
    const newValue = !isChecked
    setIsChecked(newValue)
    onChange?.(newValue)
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      disabled={disabled}
      onClick={handleToggle}
      className={cn(
        "relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        isChecked 
          ? "gradient-purple-section hover:bg-gray-700" 
          : "bg-gray-600 hover:bg-gray-700",
        className
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-6 w-6 rounded-full bg-dark shadow-lg ring-0 transition-transform",
          isChecked ? "translate-x-[37px]" : "translate-x-[3px]"
        )}
      />
    </button>
  )
} 