"use client";

import { useTheme } from "./ThemeProvider";
import { SettingSection } from "@/lib/types";

interface TomlDisplayProps {
  sections: SettingSection[];
  lastModified?: string;
}

export default function TomlDisplay({
  sections,
  lastModified,
}: TomlDisplayProps) {
  const { theme } = useTheme();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getValueColor = (value: string) => {
    // Boolean values
    if (value === "true" || value === "false") {
      return theme === "dark" ? "#c084fc" : "#7c3aed";
    }
    // Numeric values
    if (/^\d+$/.test(value)) {
      return theme === "dark" ? "#fb923c" : "#dc2626";
    }
    // String values (quoted)
    if (value.startsWith('"') && value.endsWith('"')) {
      return theme === "dark" ? "#fbbf24" : "#ca8a04";
    }
    // Default for other values (like "new", "full", etc.)
    return theme === "dark" ? "#22d3ee" : "#2563eb";
  };

  return (
    <div
      className={`font-mono text-sm rounded-xl overflow-hidden border backdrop-blur-xl ${
        theme === "dark"
          ? "mica-surface-dark border-gray-700/50"
          : "mica-surface-light border-gray-300/50"
      }`}
    >
      <div className="p-4 pt-3">
        {sections.map((section, sectionIndex) => (
          <div key={section.name} className="space-y-1.5">
            <h4
              className={`font-bold ${sectionIndex === 0 ? "mt-0" : "mt-3"} ${
                theme === "dark" ? "text-xbox-green" : "text-green-700"
              }`}
            >
              [{section.name}]
            </h4>
            {section.entries.map((entry, entryIndex) => (
              <div
                key={`${section.name}.${entry.key}`}
                className="flex items-center gap-2"
              >
                <span
                  className={
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }
                >
                  {entry.key} ={" "}
                  <span
                    className="font-semibold"
                    style={{ color: getValueColor(entry.value) }}
                  >
                    {entry.value}
                  </span>
                </span>
                {entry.comment && (
                  <span
                    className={`text-xs italic ${
                      theme === "dark" ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    # {entry.comment}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
        {lastModified && (
          <div
            className={`flex justify-end text-xs pt-2 mt-2 border-t ${
              theme === "dark"
                ? "text-gray-500 border-gray-700/50"
                : "text-gray-400 border-gray-300/50"
            }`}
          >
            Last Updated: {formatDate(lastModified)}
          </div>
        )}
      </div>
    </div>
  );
}
