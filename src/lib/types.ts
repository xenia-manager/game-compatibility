/**
 * Game compatibility data structure from Xenia Canary repository
 */
export interface GameCompatibility {
  /** GitHub issue number for the game */
  issue: number;
  /** Game title ID (e.g., "415407D2") */
  id: string;
  /** Full game title */
  title: string;
  /** Last update timestamp (ISO 8601) */
  updated: string;
  /** Compatibility state: Playable, Gameplay, Loads, Unplayable, or Unknown */
  state: string;
  /** Additional labels/tags from GitHub */
  labels: string[];
  /** GitHub issue URL */
  url: string;
}

/**
 * Optimized settings game entry
 */
export interface OptimizedSettingGame {
  /** Game title ID */
  id: string;
  /** Game title */
  title: string;
  /** Last modified timestamp (ISO 8601) */
  last_modified: string;
}

/**
 * Parsed TOML setting entry
 */
export interface SettingEntry {
  /** Setting key name */
  key: string;
  /** Setting value */
  value: string;
  /** Optional comment/description */
  comment?: string;
}

/**
 * TOML section with multiple entries
 */
export interface SettingSection {
  /** Section name (e.g., "GPU", "APU") */
  name: string;
  /** List of settings in this section */
  entries: SettingEntry[];
}

/**
 * Compatibility states in display order (best to worst)
 */
export const STATE_ORDER = [
  "Playable",
  "Gameplay",
  "Loads",
  "Unplayable",
  "Unknown",
];

/**
 * Get numeric sort value for a compatibility state
 * Lower values = better compatibility
 * @param state - The compatibility state string
 * @returns Numeric value for sorting (0 = Playable, 4 = Unknown)
 */
export function getStateSortValue(state: string): number {
  const index = STATE_ORDER.indexOf(state);
  return index === -1 ? STATE_ORDER.length : index;
}
