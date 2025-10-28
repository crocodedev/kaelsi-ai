"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "@/components/ui/icon/Icon";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";


import './reset.calendar.css'

type DateInputProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
};

export function DateInput({
  label,
  placeholder = "dd/mm/yyyy",
  value,
  onChange,
  className,
  disabled,
}: DateInputProps) {
  const [displayValue, setDisplayValue] = useState(value || "");
  const [showCalendar, setShowCalendar] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const formatDate = (input: string) => {
    const numbers = input.replace(/\D/g, "");
    const limited = numbers.slice(0, 8);
    let formatted = "";
    for (let i = 0; i < limited.length; i++) {
      if (i === 2 || i === 4) formatted += "/";
      formatted += limited[i];
    }
    return formatted;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formatted = formatDate(input);
    setDisplayValue(formatted);
    onChange?.(formatted);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
    const isNumber = /[0-9]/.test(e.key);
    if (!isNumber && !allowedKeys.includes(e.key)) e.preventDefault();
  };

  useEffect(() => {
    if (value !== undefined) setDisplayValue(value);
  }, [value]);

  const handleSelectDate = (date?: Date) => {
    if (!date) return;
    const formatted = format(date, "dd/MM/yyyy");
    setDisplayValue(formatted);
    onChange?.(formatted);
    setShowCalendar(false);
  };

  const handleShowCalendar = () => {
    setShowCalendar((p) => !p)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };
    if (showCalendar) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCalendar]);


  return (
    <div ref={wrapperRef} className="flex flex-col gap-2 relative">
      {label && <label className="text-white text-sm font-medium">{label}</label>}

      <div className="relative">
        <input
          disabled={disabled}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "w-full h-12 px-4 pr-10 rounded-xl gradient-dark-section border border-white/20 text-white placeholder:text-white/50 focus:outline-none transition-colors",
            className
          )}
        />

        <button
          type="button"
          className="absolute top-1/2 right-3 transform -translate-y-1/2"
          onClick={handleShowCalendar}
        >
          <Icon name="calendar" width={16} height={16} className="text-white/70" />
        </button>
      </div>

      {showCalendar && (
        <div className="calendar absolute z-50 mt-2 p-1 rounded-xl bg-[#1a1a1a]/95 border border-white/10 shadow-lg backdrop-blur-md text-white animate-fade-in">
          <DayPicker
            mode="single"
            selected={
              displayValue
                ? new Date(displayValue.split("/").reverse().join("-"))
                : undefined
            }
            onSelect={handleSelectDate}
            captionLayout="dropdown"
            styles={{

              caption: { color: "#fff" },
              head_cell: { color: "#bbb" },
              day_selected: {
                background:
                  "linear-gradient(135deg, #ffe29f 0%, #ffa99f 48%, #ff719a 100%)",
                color: "#000",
              },
              day_today: {
                border: "1px solid rgba(255,255,255,0.4)",
                color: "#fff",
              },
              day: {
                color: "#fff",
                borderRadius: "10px",
              },
              day_outside: {
                color: "#555",
              },
            }}
          />
        </div>
      )}
    </div>
  );
}
