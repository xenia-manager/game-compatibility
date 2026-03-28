# Xenia Canary Compatibility List

A modern, responsive web application for browsing Xbox 360 game compatibility status for the Xenia Canary emulator. Built with Next.js 16 and featuring a beautiful mica-inspired design.

![Next.js](https://img.shields.io/badge/Next.js-16.2.1-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?logo=tailwind-css)

## Features

- Game Compatibility List - Browse Xbox 360 game compatibility status
- Advanced Filtering - Filter by search, state, and starting letter
- Mica Design - Beautiful translucent surfaces with backdrop blur effects
- Dark/Light Theme - Toggle between dark and light modes with smooth transitions
- Optimized Settings - View optimized emulator settings for supported games
- Pagination - Navigate through games with customizable page sizes (25, 50, 100, 200)
- Sorting - Sort by title, state, or last updated date

## Compatibility States

Games are categorized into the following compatibility states:

| State | Hex Color | Description |
|-------|-----------|-------------|
| **All** | `#0078d4` (Blue) | Shows all games regardless of state |
| **Playable** | `#166534` (Dark Green) | Game working from start to finish with minor issues |
| **Gameplay** | `#65A30D` (Lime) | You can get into the game, but expect major issues/not be able to finish the game without some workaround |
| **Loads** | `#CA8A04` (Gold) | Games that boot but don't reach gameplay |
| **Unplayable** | `#DC2626` (Red) | Games that crash or have major issues |
| **Unknown** | `#737373` (Gray) | Games that haven't been tested yet |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) or [Node.js 18+](https://nodejs.org)
- [Git](https://git-scm.com/)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Game Compatibility
```

2. Install dependencies:
```bash
bun install
```

3. Run the development server:
```bash
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Data Sources

The application fetches data from:

- **Game Compatibility**: [xenia-canary/game-compatibility](https://github.com/xenia-canary/game-compatibility/) (Parsed by [Xenia Manager's Database repository](https://raw.githubusercontent.com/xenia-manager/database/refs/heads/main/data/game-compatibility/canary.json))
- **Optimized Settings**: [xenia-manager/optimized-settings](https://github.com/xenia-manager/optimized-settings)

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles with mica theme
│   ├── layout.tsx           # Root layout with theme provider
│   └── page.tsx             # Main compatibility page
├── components/
│   ├── BackgroundLayers.tsx # Mica background effect
│   ├── CustomSelect.tsx     # Custom dropdown component
│   ├── GameCompatibilityList.tsx  # Main list component
│   ├── GameCompatibilityTable.tsx # Table with expandable rows
│   ├── Header.tsx           # Site header with theme toggle
│   ├── LetterFilterBar.tsx  # A-Z filter buttons
│   ├── StateFilterBar.tsx   # State filter with optimized toggle
│   ├── ThemeProvider.tsx    # Theme context provider
│   ├── TomlDisplay.tsx      # TOML settings viewer
└── lib/
    ├── tomlParser.ts        # TOML file parser
    └── types.ts             # TypeScript type definitions
```

## Available Scripts

```bash
bun dev          # Start development server
bun build        # Build for production
bun start        # Start production server
bun lint         # Run ESLint
```

## Technologies Used

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Mica Design** - Translucent material effects
- **TOML Parser** - Custom parser for settings files

## License

This project is licensed under the BSD 3-Clause License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Xenia Project](https://github.com/xenia-project/xenia) - Xbox 360 emulator
- [Xenia Canary](https://github.com/xenia-canary/xenia-canary) - Experimental Xenia build
- Design inspired by Windows 11 Mica material
