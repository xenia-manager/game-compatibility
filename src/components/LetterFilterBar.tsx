"use client";

import { useTheme } from "./ThemeProvider";

interface LetterFilterBarProps {
  letterFilter: string;
  onLetterFilterChange: (value: string) => void;
}

const letters = [
  "",
  "!",
  "0-9",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

export default function LetterFilterBar({
  letterFilter,
  onLetterFilterChange,
}: LetterFilterBarProps) {
  const { theme } = useTheme();

  return (
    <div className="flex flex-wrap gap-0 mb-3 w-full">
      <div
        className={`inline-flex rounded-full overflow-hidden border w-full ${
          theme === "dark" ? "border-gray-700" : "border-gray-300"
        }`}
      >
        {letters.map((letter, index) => {
          const isSelected = letterFilter === letter;
          const isFirst = index === 0;
          const isLast = index === letters.length - 1;

          return (
            <button
              key={letter || "all"}
              onClick={() => onLetterFilterChange(letter)}
              className={`flex-1 px-1.5 py-1.5 text-xs font-semibold transition-all duration-200 min-w-[24px] ${
                isSelected
                  ? "bg-xbox-button text-white"
                  : theme === "dark"
                    ? "bg-dark-secondary text-fluent-neutral hover:bg-white/10"
                    : "bg-light-secondary text-gray-600 hover:bg-black/5"
              } ${!isLast ? (theme === "dark" ? "border-r border-gray-700" : "border-r border-gray-300") : ""}`}
              title={
                letter === ""
                  ? "All letters"
                  : letter === "0-9"
                    ? "Numbers"
                    : letter === "!"
                      ? "Special characters"
                      : letter
              }
            >
              {letter === "" ? "All" : letter}
            </button>
          );
        })}
      </div>
    </div>
  );
}
