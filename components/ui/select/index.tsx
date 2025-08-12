"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Icon } from "../icon/Icon"
import { Portal } from "../portal"

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function Select({
  options,
  value,
  onChange,
  placeholder = "Select option",
  className,
  disabled = false
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(value || options[0]?.value)
  const selectRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(option => option.value === selectedValue)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (optionValue: string) => {
    setSelectedValue(optionValue)
    onChange?.(optionValue)
    setIsOpen(false)
  }

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div className={cn("relative ", className)} ref={selectRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
        className={cn(
          "gradient-dark-section  relative border border-white/20 rounded-xl z-50 flex items-center justify-between p-4 w-24 gap-4 ", isOpen && "gradient-purple-section")}
      >
        <span className="text-white font-medium">
          {selectedOption?.label || placeholder}
        </span>
        <Icon
          name="chevron"
          className={cn(
            "w-4 h-4  transition-transform duration-200",
            !isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute z-20  flex flex-col justify-start max-h-52 py-8 pb-4 px-4 option-field hide-scrollbar  rounded-xl gap-2 -translate-y-5 items-start w-24 overflow-y-auto">
          {options.map((option) => (
            <div key={option.value} className="w-full  flex flex-col items-start gap-2">

              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={cn("text-white/70 text-sm",
                  option.value === selectedValue && "text-white"
                )}
              >
                {option.label}
              </button>
              <hr className="w-full border-white/20" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 