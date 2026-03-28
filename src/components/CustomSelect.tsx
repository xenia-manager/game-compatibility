"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "./ThemeProvider";

interface SelectOption {
  value: number | string;
  label: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: number | string;
  onChange: (value: number | string) => void;
  className?: string;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  className = "",
}: CustomSelectProps) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((opt) => opt.value === value)?.label || "";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: number | string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`input-fluent w-full flex items-center justify-between cursor-pointer transition-all duration-200`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="truncate">{selectedLabel}</span>
        <span
          className={`ml-2 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div
          className={`absolute z-50 w-full mt-1 rounded-xl overflow-hidden backdrop-blur-xl ${
            theme === "dark"
              ? "mica-card-dark border border-gray-700"
              : "mica-card-light border border-gray-200"
          }`}
          role="listbox"
        >
          <div className="max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`w-full px-4 py-3 text-left transition-colors duration-150 ${
                  value === option.value
                    ? theme === "dark"
                      ? "bg-xbox-green/20 text-xbox-green"
                      : "bg-xbox-green/20 text-xbox-button"
                    : theme === "dark"
                    ? "text-fluent-neutral-dark hover:bg-white/5"
                    : "text-gray-900 hover:bg-black/5"
                }`}
                role="option"
                aria-selected={value === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
