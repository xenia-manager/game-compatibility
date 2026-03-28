"use client";

import { useTheme } from "./ThemeProvider";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className={`flex justify-between items-center px-3 md:px-6 py-3
                  sticky top-0 z-50
                  ${
                    theme === "dark"
                      ? "mica-surface-dark"
                      : "mica-surface-light"
                  }`}
    >
      <div className="flex items-center gap-3">
        <img
          src="https://avatars.githubusercontent.com/u/173571265?s=200&v=4"
          alt="Xenia Logo"
          width={40}
          height={40}
          className="rounded-xl shadow-lg"
        />
        <h1 className="text-lg md:text-xl font-bold gradient-text">
          Game Compatibility
        </h1>
      </div>

      <button
        onClick={toggleTheme}
        aria-label="Toggle Theme"
        className={`p-2 rounded-lg cursor-pointer text-lg
                   transition-all duration-300
                   focus-indicator
                   ${
                     theme === "dark"
                       ? "bg-dark-accent hover:bg-dark-accent/80"
                       : "bg-light-accent hover:bg-light-accent/80"
                   }`}
      >
        <span className="block w-5 h-5 flex items-center justify-center">
          {theme === "dark" ? "🌙" : "☀️"}
        </span>
      </button>
    </header>
  );
}
