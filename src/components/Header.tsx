"use client";

import { useTheme } from "./ThemeProvider";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className="flex justify-between items-center px-3 sm:px-4 md:px-6 py-2.5 sm:py-3
                  sticky top-0 z-50
                  mica-surface backdrop-blur-xl"
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <img
          src="https://avatars.githubusercontent.com/u/173571265?s=200&v=4"
          alt="Xenia Logo"
          width={32}
          height={32}
          className="rounded-xl shadow-lg w-8 h-8 sm:w-10 sm:h-10"
        />
        <h1 className="text-base sm:text-lg md:text-xl font-bold gradient-text">
          Game Compatibility
        </h1>
      </div>

      <button
        onClick={toggleTheme}
        aria-label="Toggle Theme"
        className="p-2 sm:p-2.5 rounded-lg cursor-pointer text-lg
                   transition-all duration-300
                   focus-indicator
                   bg-[var(--bg-accent)] hover:bg-[var(--bg-accent)]/80
                   min-w-[40px] min-h-[40px] flex items-center justify-center"
      >
        <span className="block w-5 h-5 flex items-center justify-center">
          {theme === "dark" ? "🌙" : "☀️"}
        </span>
      </button>
    </header>
  );
}
