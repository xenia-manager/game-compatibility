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
    <div className="flex flex-wrap gap-0 mb-3 w-full">
      <div className="inline-flex rounded-full overflow-hidden border w-full border-[var(--border-color)]">
        {letters.map((letter, index) => {
          const isSelected = letterFilter === letter;
          const isLast = index === letters.length - 1;

          return (
            <button
              key={letter || "all"}
              onClick={() => onLetterFilterChange(letter)}
              className={`flex-1 px-1.5 py-1.5 text-xs font-semibold transition-all duration-200 min-w-[24px] ${
                isSelected
                  ? "bg-xbox-button text-white"
                  : "bg-[var(--bg-secondary)] text-fluent-secondary hover:bg-[var(--hover-bg)]"
              } ${!isLast ? "border-r border-[var(--border-color)]" : ""}`}
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
