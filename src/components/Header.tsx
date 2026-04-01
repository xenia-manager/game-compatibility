"use client";

import { useTheme } from "./ThemeProvider";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <a href="https://xenia-manager.github.io/game-compatibility" className="flex items-center gap-3 group">
            <img
              src="/favicon.png"
              alt="Xenia Manager"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl shadow-lg"
            />
            <span className="text-xl font-bold gradient-text">
              Game Compatibility
            </span>
          </a>

          {/* Navigation Links - Centered */}
          <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            <a
              href="https://xenia-manager.github.io/"
              rel="noopener noreferrer"
              className="text-[var(--foreground)]/80 hover:text-[var(--color-xbox-green)] transition-colors font-medium"
            >
              Xenia Manager
            </a>
            <a
              href="https://xenia-manager.github.io/xenia-mirror/"
              rel="noopener noreferrer"
              className="text-[var(--foreground)]/80 hover:text-[var(--color-xbox-green)] transition-colors font-medium"
            >
              Xenia Canary Releases
            </a>
          </nav>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2.5 rounded-lg cursor-pointer text-lg
                       transition-all duration-300
                       focus-indicator
                       bg-[var(--bg-accent)] hover:bg-[var(--bg-accent)]/80
                       min-w-[40px] min-h-[40px] flex items-center justify-center"
          >
            <span className="block w-5 h-5 flex items-center justify-center">
              {theme === "dark" ? "🌙" : "☀️"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
