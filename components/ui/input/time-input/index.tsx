"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TimeInputProps {
  label?: string;
  value?: string;
  onChange?: (v: string) => void;
  classNameWrapper?: string;
}

export const TimeInput = ({
  label,
  value,
  onChange,
  classNameWrapper,
}: TimeInputProps) => {
  const [show, setShow] = useState(false);
  const [hour, setHour] = useState<number>(0);
  const [minute, setMinute] = useState<number>(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const hourListRef = useRef<HTMLDivElement>(null);
  const minuteListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(":").map(Number);
      if (!isNaN(h) && !isNaN(m)) {
        setHour(h);
        setMinute(m);
      }
    }
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setShow(false);
    };
    if (show) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [show]);

  useEffect(() => {
    if (show) {
      const hourEl = hourListRef.current?.children[hour] as HTMLElement;
      const minuteEl = minuteListRef.current?.children[minute] as HTMLElement;
      hourEl?.scrollIntoView({ behavior: "smooth", block: "center" });
      minuteEl?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [show]);

  const handleSelect = (h: number, m: number) => {
    const formatted = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    setHour(h);
    setMinute(m);
    onChange?.(formatted);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    return;
  };

  const handleShowInput = () => {
    setShow(prev => !prev);
  }

  const formatted = value || `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div ref={wrapperRef} className={cn("flex flex-col gap-2", classNameWrapper)}>
      {label && <label className="text-white text-sm font-medium">{label}</label>}

      <div className="relative">
        <input
          type="text"
          value={formatted}
          onClick={handleShowInput}
          onChange={handleInput}
          placeholder="00:00"
          maxLength={5}
          className="w-full h-12 px-4 pr-10 rounded-xl gradient-dark-section border border-white/20 text-white placeholder:text-white/50 focus:outline-none"
        />

        <div
          className="absolute top-1/2 right-3 -translate-y-1/2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 text-white/70"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
      </div>

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 calendar rounded-xl bg-[#1a1a1a]/95 border border-white/10 shadow-lg backdrop-blur-md text-white py-4 overflow-hidden"
          >
            <div className="relative flex justify-center gap-6">

              <div
                ref={hourListRef}
                className="relative w-20 h-36 overflow-y-scroll snap-y snap-mandatory hide-scrollbar"
              >
                {hours.map((h) => (
                  <div
                    key={h}
                    onClick={() => handleSelect(h, minute)}
                    className={cn(
                      "h-12 flex items-center justify-center text-lg snap-center cursor-pointer select-none transition-transform",
                      h === hour
                        ? "text-transparent bg-clip-text bg-gradient-to-r from-[#b182db] to-[#b182db] font-semibold scale-110"
                        : "text-white/60"
                    )}
                  >
                    {String(h).padStart(2, "0")}
                  </div>
                ))}
              </div>

              <div
                ref={minuteListRef}
                className="relative w-20 h-36 overflow-y-scroll hide-scrollbar snap-y snap-mandatory"
              >
                {minutes.map((m) => (
                  <div
                    key={m}
                    onClick={() => handleSelect(hour, m)}
                    className={cn(
                      "h-12 flex items-center justify-center text-lg snap-center cursor-pointer select-none transition-transform",
                      m === minute
                        ? "text-transparent bg-clip-text bg-gradient-to-r from-[#b182db] to-[#b182db] font-semibold scale-110"
                        : "text-white/60"
                    )}
                  >
                    {String(m).padStart(2, "0")}
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={() => setShow(false)}
              type='button'
              className="mt-3 text-sm text-white/60 hover:text-white mx-auto block"
            >
              Готово
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
