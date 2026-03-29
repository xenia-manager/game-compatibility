import { SettingSection } from "@/lib/types";
import { fetchWithFallback, getSettingsConfig } from "@/lib/fetchWithFallback";

/**
 * Parse TOML content into structured sections and entries
 * @param tomlContent - Raw TOML string content
 * @returns Array of setting sections with entries
 *
 * @example
 * // Input TOML:
 * // [GPU]
 * // vsync = false # Disable V-Sync
 * // framerate_limit = 60
 *
 * // Output:
 * // [{ name: "GPU", entries: [{ key: "vsync", value: "false", comment: "Disable V-Sync" }, ...] }]
 */
export function parseToml(tomlContent: string): SettingSection[] {
  const sections: SettingSection[] = [];
  let currentSection: SettingSection | null = null;

  const lines = tomlContent.split("\n");

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Skip empty lines
    if (!trimmedLine) {
      continue;
    }

    // Check for section header [SectionName]
    const sectionMatch = trimmedLine.match(/^\[([^\]]+)\]$/);
    if (sectionMatch) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        name: sectionMatch[1],
        entries: [],
      };
      continue;
    }

    // Check for key = value or key = value # comment
    if (currentSection && trimmedLine.includes("=")) {
      const equalsIndex = trimmedLine.indexOf("=");
      const key = trimmedLine.substring(0, equalsIndex).trim();
      const valueAndComment = trimmedLine.substring(equalsIndex + 1).trim();

      // Check for comment
      let value = valueAndComment;
      let comment: string | undefined;

      // Handle quoted strings that might contain #
      const quoteMatch = valueAndComment.match(/^"([^"]*)"(\s*#\s*(.*))?$/);
      if (quoteMatch) {
        value = `"${quoteMatch[1]}"`;
        comment = quoteMatch[3];
      } else {
        // Simple split on # for non-quoted values
        const commentIndex = valueAndComment.indexOf("#");
        if (commentIndex !== -1) {
          value = valueAndComment.substring(0, commentIndex).trim();
          comment = valueAndComment.substring(commentIndex + 1).trim();
        }
      }

      currentSection.entries.push({
        key,
        value,
        comment,
      });
    }
  }

  // Don't forget the last section
  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
}

/**
 * Fetch optimized settings for a specific game from GitHub
 * @param gameId - Game title ID (e.g., "415407D2")
 * @returns Parsed settings sections or null if not found/failed
 *
 * @remarks
 * Fetches from: xenia-manager/optimized-settings/settings/{gameId}.toml
 * Game IDs are converted to uppercase for the URL
 * Uses GitHub Pages as primary, Raw GitHub as backup
 */
export async function fetchOptimizedSettings(
  gameId: string,
): Promise<SettingSection[] | null> {
  try {
    const config = getSettingsConfig(gameId);
    const response = await fetchWithFallback(config);
    const tomlContent = await response.text();
    return parseToml(tomlContent);
  } catch (error) {
    console.error(`Failed to fetch settings for game ${gameId}:`, error);
    return null;
  }
}
