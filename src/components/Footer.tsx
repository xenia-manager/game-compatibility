"use client";

export default function Footer() {
  return (
    <footer className="w-full py-6 px-4 mica-surface backdrop-blur-xl border-t border-[var(--border-color)] border-b-0 border-l-0 border-r-0">
      <div className="max-w-5xl mx-auto space-y-2 text-center">
        <p className="text-fluent-secondary text-sm">
          Powered by Xenia Manager • Not affiliated with Xenia Team
        </p>
        <div className="flex items-center justify-center gap-4 text-sm">
          <a
            href="https://github.com/xenia-manager/game-compatibility"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xbox-green hover:text-xbox-hover transition-colors link-style"
          >
            Source Code
          </a>
          <span className="text-fluent-secondary">•</span>
          <a
            href="https://github.com/xenia-canary/game-compatibility/issues?q=sort%3Aupdated-desc+is%3Aissue+is%3Aopen"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xbox-green hover:text-xbox-hover transition-colors link-style"
          >
            Source
          </a>
        </div>
      </div>
    </footer>
  );
}
