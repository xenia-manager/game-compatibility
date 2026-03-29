"use client";

import { useEffect, useState, useMemo } from "react";
import {
  GameCompatibility,
  OptimizedSettingGame,
  getStateSortValue,
} from "@/lib/types";
import GameCompatibilityTable from "./GameCompatibilityTable";
import StateFilterBar from "./StateFilterBar";
import CustomSelect from "./CustomSelect";
import LetterFilterBar from "./LetterFilterBar";
import { fetchWithFallback, FETCH_CONFIGS } from "@/lib/fetchWithFallback";

type SortColumn = "title" | "state" | "updated" | null;
type SortDirection = "asc" | "desc";

const DEFAULT_PAGE_SIZE = 25;
const PAGE_SIZE_OPTIONS = [25, 50, 100, 200];

export default function GameCompatibilityList() {
  const [allGames, setAllGames] = useState<GameCompatibility[]>([]);
  const [optimizedGames, setOptimizedGames] = useState<OptimizedSettingGame[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  // Filter states
  const [searchValue, setSearchValue] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [letterFilter, setLetterFilter] = useState("");
  const [showOptimizedOnly, setShowOptimizedOnly] = useState(false);

  // Sorting
  const [sortColumn, setSortColumn] = useState<SortColumn>("title");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Fetch all games initially
  useEffect(() => {
    async function fetchData() {
      try {
        const [gamesResponse, settingsResponse] = await Promise.all([
          fetchWithFallback(FETCH_CONFIGS.gameCompatibility),
          fetchWithFallback(FETCH_CONFIGS.optimizedSettingsList),
        ]);

        const gamesData = await gamesResponse.json();
        const settingsData = await settingsResponse.json();

        setAllGames(gamesData);
        setOptimizedGames(settingsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter games based on search and state
  const filteredGames = useMemo(() => {
    return allGames.filter((game) => {
      // Skip invalid entries
      if (!game.title || !game.id || !game.updated) {
        return false;
      }

      // Optimized settings filter
      const hasOptimizedSettings = optimizedGames.some((g) => g.id === game.id);
      if (showOptimizedOnly && !hasOptimizedSettings) {
        return false;
      }

      // Search filter
      const searchLower = searchValue.toLowerCase().trim();
      const inTitle = game.title.toLowerCase().includes(searchLower);
      const inId = game.id.toLowerCase().includes(searchLower);
      const matchesSearch = searchValue === "" || inTitle || inId;

      // State filter
      const matchesState = stateFilter === "" || game.state === stateFilter;

      // Letter filter
      const matchesLetter =
        letterFilter === "" ||
        (letterFilter === "!" && !/^[a-zA-Z0-9]/.test(game.title)) ||
        (letterFilter === "0-9" && /^[0-9]/.test(game.title)) ||
        (letterFilter.length === 1 &&
          game.title.toUpperCase().startsWith(letterFilter));

      return matchesSearch && matchesState && matchesLetter;
    });
  }, [
    allGames,
    optimizedGames,
    searchValue,
    stateFilter,
    letterFilter,
    showOptimizedOnly,
  ]);

  // Sort filtered games
  const sortedGames = useMemo(() => {
    if (!sortColumn) {
      return filteredGames;
    }

    return [...filteredGames].sort((a, b) => {
      let comparison = 0;

      switch (sortColumn) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "state":
          comparison = getStateSortValue(a.state) - getStateSortValue(b.state);
          break;
        case "updated":
          comparison =
            new Date(a.updated).getTime() - new Date(b.updated).getTime();
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredGames, sortColumn, sortDirection]);

  // Calculate state counts for filter buttons
  const stateCounts = useMemo(() => {
    const counts: Record<string, number> = {
      "": allGames.length, // All states
      Playable: 0,
      Gameplay: 0,
      Loads: 0,
      Unplayable: 0,
      Unknown: 0,
    };

    allGames.forEach((game) => {
      if (game.state in counts) {
        counts[game.state]++;
      }
    });

    return counts;
  }, [allGames]);

  // Calculate optimized games count
  const optimizedCount = useMemo(() => {
    return optimizedGames.length;
  }, [optimizedGames]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedGames.length / pageSize);
  const paginatedGames = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedGames.slice(startIndex, endIndex);
  }, [sortedGames, currentPage, pageSize]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, stateFilter, letterFilter, showOptimizedOnly, pageSize]);

  const handleClear = () => {
    setSearchValue("");
    setStateFilter("");
    setLetterFilter("");
    setShowOptimizedOnly(false);
  };

  const handleSort = (column: SortColumn) => {
    if (column === sortColumn) {
      // Toggle direction if same column
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New column, default to ascending
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="text-center rounded-2xl p-12 mica-card">
        <div className="flex flex-col items-center justify-center">
          <div className="spinner mb-4"></div>
          <div className="text-fluent-secondary text-lg">
            Loading game compatibility data...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl p-8 mica-card">
        <div className="notification notification-error">
          <span className="text-xl">⚠️</span>
          <div>
            <h3 className="font-semibold">Error loading compatibility data</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="rounded-2xl p-4 sm:p-6 mica-card">
        <div className="flex flex-col gap-3">
          {/* Search bar */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px] w-full sm:w-auto">
              <label className="block text-xs font-medium mb-1.5 text-fluent-secondary">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by title or ID..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="input-fluent transition-all duration-200 text-sm py-2.5 pr-10"
                />
                {searchValue && (
                  <button
                    onClick={() => setSearchValue("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full transition-colors text-fluent-secondary hover:bg-white/10"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div className="w-full sm:w-auto">
              <label className="block text-xs font-medium mb-1.5 text-fluent-secondary">
                Results per page
              </label>
              <CustomSelect
                options={PAGE_SIZE_OPTIONS.map((size) => ({
                  value: size,
                  label: `${size} games`,
                }))}
                value={pageSize}
                onChange={(val) => setPageSize(Number(val))}
                className="min-w-[130px] w-full sm:w-auto"
              />
            </div>

            <div className="w-full sm:w-auto">
              <label className="block text-xs font-medium mb-1.5 opacity-0 pointer-events-none text-fluent-secondary">
                Clear
              </label>
              <button
                onClick={handleClear}
                className="btn-xbox transition-all duration-200 min-w-[80px] w-full sm:w-auto text-sm py-2 px-3 hover:!transform-none hover:!translate-y-0"
              >
                Clear
              </button>
            </div>
          </div>

          {/* State filter buttons */}
          <StateFilterBar
            stateFilter={stateFilter}
            onStateFilterChange={setStateFilter}
            stateCounts={stateCounts}
            optimizedCount={optimizedCount}
            showOptimizedOnly={showOptimizedOnly}
            onShowOptimizedOnlyChange={setShowOptimizedOnly}
          />

          {/* Letter filter buttons */}
          <LetterFilterBar
            letterFilter={letterFilter}
            onLetterFilterChange={setLetterFilter}
          />
        </div>

        {/* Games table */}
        <div className="mt-6">
          <GameCompatibilityTable
            games={paginatedGames}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
            optimizedGames={optimizedGames}
          />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4">
            <button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="px-2.5 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 aria-disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:bg-gray-500 bg-white/10 hover:bg-white/15"
              aria-label="First page"
            >
              ««
            </button>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2.5 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 aria-disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:bg-gray-500 bg-white/10 hover:bg-white/15"
              aria-label="Previous page"
            >
              «
            </button>

            <div className="flex items-center gap-0.5">
              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 py-1.5 text-xs text-fluent-secondary"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => goToPage(page as number)}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                      currentPage === page
                        ? "btn-xbox hover:scale-105 border border-xbox-green"
                        : "bg-white/10 hover:bg-white/15 text-fluent-primary hover:scale-105 border border-[var(--border-color)]"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2.5 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 aria-disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:bg-gray-500 bg-white/10 hover:bg-white/15"
              aria-label="Next page"
            >
              »
            </button>
            <button
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2.5 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 aria-disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:bg-gray-500 bg-white/10 hover:bg-white/15"
              aria-label="Last page"
            >
              »»
            </button>
          </div>
        )}
      </section>
    </>
  );
}
