"use client";

import { useState, useEffect, Fragment } from "react";
import { useTheme } from "./ThemeProvider";
import { GameCompatibility, OptimizedSettingGame } from "@/lib/types";
import { fetchOptimizedSettings, parseToml } from "@/lib/tomlParser";
import TomlDisplay from "./TomlDisplay";

type SortColumn = "title" | "state" | "updated" | null;
type SortDirection = "asc" | "desc";

interface GameCompatibilityTableProps {
  games: GameCompatibility[];
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  onSort: (column: SortColumn) => void;
  optimizedGames: OptimizedSettingGame[];
}

function getStateColor(state: string): string {
  switch (state) {
    case "Unplayable":
      return "#DC2626";
    case "Loads":
      return "#CA8A04";
    case "Gameplay":
      return "#65A30D";
    case "Playable":
      return "#166534";
    case "Unknown":
    default:
      return "#737373";
  }
}

function getStateLabel(state: string): string {
  switch (state) {
    case "Unplayable":
      return "Unplayable";
    case "Loads":
      return "Loads";
    case "Gameplay":
      return "Gameplay";
    case "Playable":
      return "Playable";
    case "Unknown":
    default:
      return "Unknown";
  }
}

function getStateDescription(state: string): string {
  switch (state) {
    case "Playable":
      return "Game working from start to finish with minor issues";
    case "Gameplay":
      return "You can get into the game, but expect major issues/not be able to finish without workaround";
    case "Loads":
      return "Games that boot but don't reach gameplay";
    case "Unplayable":
      return "Games that crash or have major issues";
    case "Unknown":
    default:
      return "Games that haven't been tested yet";
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface SortableHeaderProps {
  column: SortColumn;
  currentSort: SortColumn;
  direction: SortDirection;
  onSort: (column: SortColumn) => void;
  children: React.ReactNode;
  className?: string;
  width?: string;
}

function SortableHeader({
  column,
  currentSort,
  direction,
  onSort,
  children,
  className = "",
  width,
}: SortableHeaderProps) {
  const { theme } = useTheme();
  const isActive = currentSort === column;

  return (
    <th
      className={`text-left py-3 px-4 font-semibold cursor-pointer hover:opacity-80 transition-opacity ${
        theme === "dark" ? "text-fluent-neutral-dark" : "text-gray-900"
      } ${className}`}
      style={{ width }}
      onClick={() => onSort(column)}
    >
      <div className="flex items-center gap-2">
        {children}
        <span className="text-xs">
          {isActive ? (direction === "asc" ? "↑" : "↓") : "↕"}
        </span>
      </div>
    </th>
  );
}

export default function GameCompatibilityTable({
  games,
  sortColumn,
  sortDirection,
  onSort,
  optimizedGames,
}: GameCompatibilityTableProps) {
  const { theme } = useTheme();
  const [expandedIssues, setExpandedIssues] = useState<Set<number>>(new Set());
  const [loadingSettings, setLoadingSettings] = useState<number | null>(null);
  const [settingsCache, setSettingsCache] = useState<Record<string, any>>({});

  const hasOptimizedSettings = (gameId: string) => {
    return optimizedGames.some((g) => g.id === gameId);
  };

  const getOptimizedGame = (gameId: string) => {
    return optimizedGames.find((g) => g.id === gameId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleTitleClick = async (gameId: string, issue: number) => {
    const isExpanded = expandedIssues.has(issue);

    if (isExpanded) {
      // Collapse this entry
      setExpandedIssues((prev) => {
        const newSet = new Set(prev);
        newSet.delete(issue);
        return newSet;
      });
      return;
    }

    if (!hasOptimizedSettings(gameId)) {
      return;
    }

    // Expand this entry (keep others expanded)
    setExpandedIssues((prev) => new Set(prev).add(issue));

    // Fetch settings if not cached
    if (!settingsCache[gameId]) {
      setLoadingSettings(issue);
      const sections = await fetchOptimizedSettings(gameId);
      if (sections) {
        setSettingsCache((prev) => ({ ...prev, [gameId]: sections }));
      }
      setLoadingSettings(null);
    }
  };

  if (games.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🎮</div>
        <p
          className={`${theme === "dark" ? "text-fluent-neutral" : "text-gray-500"} text-lg mb-2`}
        >
          No games found
        </p>
        <p
          className={`${theme === "dark" ? "text-fluent-neutral" : "text-gray-500"}`}
        >
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr
            className={`border-b ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <th
              className={`text-left py-3 px-4 font-semibold ${
                theme === "dark" ? "text-fluent-neutral" : "text-gray-600"
              }`}
              style={{ width: "100px" }}
            >
              ID
            </th>
            <SortableHeader
              column="title"
              currentSort={sortColumn}
              direction={sortDirection}
              onSort={onSort}
              width="40%"
            >
              Title
            </SortableHeader>
            <SortableHeader
              column="state"
              currentSort={sortColumn}
              direction={sortDirection}
              onSort={onSort}
              width="120px"
            >
              State
            </SortableHeader>
            <SortableHeader
              column="updated"
              currentSort={sortColumn}
              direction={sortDirection}
              onSort={onSort}
              width="130px"
            >
              Updated
            </SortableHeader>
            <th
              className={`text-left py-3 px-4 font-semibold ${
                theme === "dark" ? "text-fluent-neutral-dark" : "text-gray-900"
              }`}
              style={{ width: "100px" }}
            ></th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => {
            const isExpanded = expandedIssues.has(game.issue);
            const hasSettings = hasOptimizedSettings(game.id);
            const isLoading = loadingSettings === game.issue;
            const sections = settingsCache[game.id];

            return (
              <Fragment key={game.issue}>
                <tr
                  className={`border-b transition-colors duration-200 ${
                    theme === "dark"
                      ? "border-gray-800 hover:bg-white/5"
                      : "border-gray-100 hover:bg-black/5"
                  } ${isExpanded ? (theme === "dark" ? "bg-white/5" : "bg-black/5") : ""}`}
                >
                  <td className="py-3 px-4">
                    <code
                      className={`font-mono text-sm ${
                        theme === "dark"
                          ? "text-fluent-neutral"
                          : "text-gray-600"
                      }`}
                    >
                      {game.id}
                    </code>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleTitleClick(game.id, game.issue)}
                      className={`text-left font-medium transition-colors duration-200 ${
                        hasSettings
                          ? theme === "dark"
                            ? "text-xbox-green hover:text-xbox-accent cursor-pointer"
                            : "text-xbox-button hover:text-xbox-hover cursor-pointer"
                          : theme === "dark"
                            ? "text-fluent-neutral-dark"
                            : "text-gray-900"
                      }`}
                      disabled={!hasSettings}
                      title={
                        hasSettings
                          ? "Click to view optimized settings"
                          : "No optimized settings available"
                      }
                    >
                      {game.title}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: `${getStateColor(game.state)}20`,
                        color: getStateColor(game.state),
                        border: `1px solid ${getStateColor(game.state)}60`,
                      }}
                      title={getStateDescription(game.state)}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getStateColor(game.state) }}
                      />
                      {getStateLabel(game.state)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-sm ${
                        theme === "dark"
                          ? "text-fluent-neutral"
                          : "text-gray-600"
                      }`}
                    >
                      {formatDate(game.updated)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <a
                      href={game.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-style text-sm font-medium"
                    >
                      #{game.issue}
                    </a>
                  </td>
                </tr>
                {isExpanded && (
                  <tr>
                    <td colSpan={5} className="py-4 px-4">
                      {isLoading ? (
                        <div className="flex items-center gap-2 py-4">
                          <div className="spinner"></div>
                          <span
                            className={
                              theme === "dark"
                                ? "text-fluent-neutral"
                                : "text-gray-600"
                            }
                          >
                            Loading optimized settings...
                          </span>
                        </div>
                      ) : sections ? (
                        <TomlDisplay
                          sections={sections}
                          lastModified={
                            getOptimizedGame(game.id)?.last_modified
                          }
                        />
                      ) : (
                        <p
                          className={
                            theme === "dark"
                              ? "text-fluent-neutral"
                              : "text-gray-600"
                          }
                        >
                          Failed to load settings
                        </p>
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
