"use client";

import { useTheme } from "./ThemeProvider";

interface StateFilter {
  value: string;
  label: string;
  color: string;
  description: string;
}

const stateFilters: StateFilter[] = [
  {
    value: "",
    label: "All",
    color: "#0078d4",
    description: "Shows all games regardless of state",
  },
  {
    value: "Playable",
    label: "Playable",
    color: "#166534",
    description: "Game working from start to finish with minor issues",
  },
  {
    value: "Gameplay",
    label: "Gameplay",
    color: "#65A30D",
    description:
      "You can get into the game, but expect major issues/not be able to finish without workaround",
  },
  {
    value: "Loads",
    label: "Loads",
    color: "#CA8A04",
    description: "Games that boot but don't reach gameplay",
  },
  {
    value: "Unplayable",
    label: "Unplayable",
    color: "#DC2626",
    description: "Games that crash or have major issues",
  },
  {
    value: "Unknown",
    label: "Unknown",
    color: "#737373",
    description: "Games that haven't been tested yet",
  },
];

interface StateFilterBarProps {
  stateFilter: string;
  onStateFilterChange: (value: string) => void;
  stateCounts: Record<string, number>;
  optimizedCount: number;
  showOptimizedOnly: boolean;
  onShowOptimizedOnlyChange: (value: boolean) => void;
}

export default function StateFilterBar({
  stateFilter,
  onStateFilterChange,
  stateCounts,
  optimizedCount,
  showOptimizedOnly,
  onShowOptimizedOnlyChange,
}: StateFilterBarProps) {
  const { theme } = useTheme();

  return (
    <div className="flex justify-between items-center mb-3">
      <div className="flex flex-wrap gap-1.5">
        {stateFilters.map((filter) => {
          const isSelected = stateFilter === filter.value;
          const bgColor = isSelected ? filter.color : `${filter.color}20`;
          const textColor = isSelected ? "#000000" : filter.color;
          const borderColor = `${filter.color}60`;
          const count = stateCounts[filter.value] ?? 0;

          return (
            <button
              key={filter.value || "all"}
              onClick={() => onStateFilterChange(filter.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border flex items-center gap-1.5 ${
                isSelected ? "scale-105 shadow-lg" : "hover:scale-105"
              }`}
              style={{
                backgroundColor: bgColor,
                color: textColor,
                borderColor: borderColor,
                borderWidth: "1px",
              }}
              title={filter.description}
            >
              {filter.label}
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  isSelected ? "bg-black/20" : "bg-black/10"
                }`}
                style={{ color: isSelected ? "#000000" : filter.color }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onShowOptimizedOnlyChange(!showOptimizedOnly)}
        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border flex items-center gap-1.5 ${
          showOptimizedOnly
            ? "bg-[#107c10] text-white border-[#107c10] shadow-lg scale-105"
            : theme === "dark"
              ? "bg-dark-secondary text-fluent-neutral border-gray-700 hover:bg-white/10"
              : "bg-light-secondary text-gray-600 border-gray-300 hover:bg-black/5"
        }`}
        title="Show only games that have optimized emulator settings available"
      >
        Optimized Settings
        <span
          className={`px-1.5 py-0.5 rounded-full text-[10px] ${
            showOptimizedOnly ? "bg-white/20" : "bg-black/10"
          }`}
          style={{
            color: showOptimizedOnly
              ? "#ffffff"
              : theme === "dark"
                ? "#9CA3AF"
                : "#6B7280",
          }}
        >
          {optimizedCount}
        </span>
      </button>
    </div>
  );
}
