"use client";

import { SettingSection } from "@/lib/types";

interface TomlDisplayProps {
  sections: SettingSection[];
  lastModified?: string;
}

export default function TomlDisplay({
  sections,
  lastModified,
}: TomlDisplayProps) {
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
      return "var(--color-fluent-accent)";
    }
    // Numeric values
    if (/^\d+$/.test(value)) {
      return "var(--color-xbox-hover)";
    }
    // String values (quoted)
    if (value.startsWith('"') && value.endsWith('"')) {
      return "var(--color-xbox-green)";
    }
    // Default for other values (like "new", "full", etc.)
    return "var(--color-fluent-accent)";
  };

  return (
    <div className="font-mono text-sm rounded-xl overflow-hidden border backdrop-blur-xl mica-surface border-[var(--border-color)]">
      <div className="p-4 pt-3">
        {sections.map((section, sectionIndex) => (
          <div key={section.name} className="space-y-1.5">
            <h4 className={`font-bold ${sectionIndex === 0 ? "mt-0" : "mt-3"} text-xbox-green`}>
              [{section.name}]
            </h4>
            {section.entries.map((entry) => (
              <div
                key={`${section.name}.${entry.key}`}
                className="flex items-center gap-2"
              >
                <span className="text-fluent-primary">
                  {entry.key} ={" "}
                  <span
                    className="font-semibold"
                    style={{ color: getValueColor(entry.value) }}
                  >
                    {entry.value}
                  </span>
                </span>
                {entry.comment && (
                  <span className="text-xs italic text-fluent-secondary">
                    # {entry.comment}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
        {lastModified && (
          <div className="flex justify-end text-xs pt-2 mt-2 border-t border-[var(--border-color)] text-fluent-secondary">
            Last Updated: {formatDate(lastModified)}
          </div>
        )}
      </div>
    </div>
  );
}
