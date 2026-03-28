# Contributing to Xenia Game Compatibility

Thank you for your interest in contributing to this project! This document provides guidelines and information for developers.

## Project Overview

This is a Next.js 16 application that displays Xbox 360 game compatibility data for the Xenia Canary emulator. It features a mica-inspired design with dark/light theme support.

## Technology Stack

- **Framework**: Next.js 16.2.1 with App Router
- **Language**: TypeScript 5.0+
- **Styling**: Tailwind CSS with custom mica effects
- **Package Manager**: Bun (recommended) or npm/yarn/pnpm

## Development Setup

### Prerequisites

- Bun 1.0+ or Node.js 18+
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Game Compatibility

# Install dependencies
bun install

# Start development server
bun dev
```

The application will be available at http://localhost:3000

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles, theme colors, mica effects
│   ├── layout.tsx           # Root layout with theme initialization
│   ├── page.tsx             # Main compatibility list page
│   └── favicon.ico          # Site favicon
├── components/
│   ├── BackgroundLayers.tsx # Mica background effect component
│   ├── CustomSelect.tsx     # Reusable dropdown select component
│   ├── GameCompatibilityList.tsx  # Main list with filtering & pagination
│   ├── GameCompatibilityTable.tsx # Table with expandable rows for settings
│   ├── Header.tsx           # Site header with theme toggle
│   ├── LetterFilterBar.tsx  # A-Z filter buttons for title filtering
│   ├── StateFilterBar.tsx   # State filter buttons with optimized toggle
│   ├── ThemeProvider.tsx    # React context for theme management
│   └── TomlDisplay.tsx      # TOML settings viewer with syntax highlighting
└── lib/
    ├── tomlParser.ts        # TOML file parser for settings
    └── types.ts             # TypeScript type definitions
```

## Key Components

### GameCompatibilityList

The main component that manages:
- Data fetching from GitHub repositories
- Filtering (search, state, letter)
- Sorting (title, state, updated date)
- Pagination (25, 50, 100, 200 per page)

**State Management:**
- `searchValue` - Text search query
- `stateFilter` - Selected compatibility state
- `letterFilter` - Selected starting letter
- `showOptimizedOnly` - Filter for games with optimized settings
- `currentPage` - Current pagination page
- `pageSize` - Items per page

### GameCompatibilityTable

Displays games in a table format with:
- Sortable columns (title, state, updated)
- Expandable rows for optimized settings
- State badges with tooltips
- Click-to-expand TOML settings viewer

### StateFilterBar

Filter buttons for compatibility states:
- All (blue, #0078d4)
- Playable (dark green, #166534)
- Gameplay (lime, #65A30D)
- Loads (gold, #CA8A04)
- Unplayable (red, #DC2626)
- Unknown (gray, #737373)
- Optimized Settings toggle

### TomlDisplay

Renders TOML settings with syntax highlighting:
- Booleans: Purple (dark) / Violet (light)
- Numbers: Orange (dark) / Red (light)
- Strings: Amber (dark) / Yellow (light)
- Other values: Cyan (dark) / Blue (light)

## Data Sources

### Game Compatibility
- **URL**: `https://raw.githubusercontent.com/xenia-manager/database/refs/heads/main/data/game-compatibility/canary.json`
- **Format**: Array of game objects
- **Fields**: issue, id, title, updated, state, labels, url

### Optimized Settings
- **List URL**: `https://raw.githubusercontent.com/xenia-manager/optimized-settings/refs/heads/refactor/toml-update/data/settings.json`
- **Settings URL**: `https://raw.githubusercontent.com/xenia-manager/optimized-settings/refs/heads/refactor/toml-update/settings/{GAME_ID}.toml`
- **Format**: TOML files with sections and key-value pairs

## Theme System

The application uses a custom theme system with mica-inspired design:

### Theme Colors

**Dark Theme:**
- Background: `#0a0a0a`
- Cards: `rgba(31, 31, 31, 0.7)`
- Text: `#c8c6c4`

**Light Theme:**
- Background: `#f5f5f5`
- Cards: `rgba(255, 255, 255, 0.7)`
- Text: `#171717`

### Mica Effects

All mica elements use backdrop blur for translucency:
- `.mica-layer` - Background with 80px blur
- `.mica-card-*` - Card surfaces with 40px blur
- `.mica-surface-*` - Light surfaces with 30px blur

### Theme Transitions

Smooth 400ms transitions between themes using `ease` timing.

## Common Tasks

### Adding New Filter Options

1. Add state in `GameCompatibilityList.tsx`
2. Add filter logic in `filteredGames` useMemo
3. Add UI component for the filter
4. Update dependencies array

### Changing State Colors

Update in two locations:
1. `StateFilterBar.tsx` - Filter button colors
2. `GameCompatibilityTable.tsx` - `getStateColor()` function

### Adding New TOML Syntax Highlighting

Edit `getValueColor()` in `TomlDisplay.tsx`:

```typescript
const getValueColor = (value: string) => {
  // Add new value type detection
  if (/* condition */) {
    return theme === "dark" ? "#color" : "#color";
  }
  // ... existing code
};
```

### Modifying Pagination

Change `DEFAULT_PAGE_SIZE` and `PAGE_SIZE_OPTIONS` in `GameCompatibilityList.tsx`:

```typescript
const DEFAULT_PAGE_SIZE = 25;
const PAGE_SIZE_OPTIONS = [25, 50, 100, 200];
```

## Build & Deployment

### Development
```bash
bun dev
```

### Production Build
```bash
bun build
bun start
```

### Environment Variables

No environment variables are required. All data is fetched from public GitHub URLs.

## Troubleshooting

### Turbopack Errors

If you encounter Turbopack crashes:
1. Delete `.next` folder: `rm -rf .next` (Unix) or `rmdir /S /Q .next` (Windows)
2. Restart dev server: `bun dev`

### Theme Not Applying

Check that:
1. `ThemeProvider` wraps the component tree
2. Inline script in `layout.tsx` runs before content
3. Browser localStorage is enabled

### Data Not Loading

Verify:
1. Internet connection
2. GitHub URLs are accessible
3. Check browser console for fetch errors

## Code Style

- Use TypeScript for type safety
- Follow existing component patterns
- Use Tailwind utility classes for styling
- Keep components focused and reusable
- Add JSDoc comments for complex functions

## Testing

Before submitting changes:
1. Test in both dark and light themes
2. Verify responsive design on mobile
3. Check filtering and sorting functionality
4. Test pagination with different page sizes
5. Verify optimized settings expand correctly

## License

BSD 3-Clause License - see LICENSE file for details.
