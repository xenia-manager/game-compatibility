"use client";

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
  return (
    <div className="mb-3 w-full">
      <div className="flex flex-wrap gap-1 rounded-xl overflow-hidden border border-[var(--border-color)] p-1">
        {/* "All" button */}
        <button
          onClick={() => onLetterFilterChange("")}
          className={`flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 rounded-lg ${
            letterFilter === ""
              ? "bg-xbox-button text-white"
              : "bg-[var(--bg-secondary)] text-fluent-secondary hover:bg-[var(--hover-bg)]"
          }`}
        >
          All
        </button>

        {/* Letter buttons - wrap on mobile */}
        {letters
          .filter((l) => l !== "")
          .map((letter, index) => {
            const isSelected = letterFilter === letter;

            return (
              <button
                key={letter}
                onClick={() => onLetterFilterChange(letter)}
                className={`flex-none px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 min-w-[36px] sm:min-w-[40px] flex items-center justify-center rounded-lg ${
                  isSelected
                    ? "bg-xbox-button text-white"
                    : "bg-[var(--bg-secondary)] text-fluent-secondary hover:bg-[var(--hover-bg)]"
                }`}
                title={
                  letter === "0-9"
                    ? "Numbers"
                    : letter === "!"
                      ? "Special characters"
                      : letter
                }
              >
                {letter}
              </button>
            );
          })}
      </div>
    </div>
  );
}
