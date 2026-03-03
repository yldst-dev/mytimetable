# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a SvelteKit-based timetable web application that displays a weekly class schedule in Korean. The app shows course information including professor names, room locations, and time slots with color-coded professor indicators.

## Development Commands

**Development server:**

```bash
npm run dev          # Start development server
npm run dev -- --open   # Start dev server and open browser
```

**Build and preview:**

```bash
npm run build        # Build for production
npm run preview      # Preview production build
```

**Code quality:**

```bash
npm run check        # Run Svelte type checking
npm run check:watch  # Run type checking in watch mode
npm run format       # Format code with Prettier
npm run lint         # Check formatting with Prettier
```

## Architecture

### Stack

- **Framework:** SvelteKit with Svelte 5
- **Styling:** TailwindCSS 4.0 with custom Korean font (Pretendard)
- **Language:** TypeScript
- **Build:** Vite
- **Adapter:** @sveltejs/adapter-auto

### Project Structure

```
src/
├── lib/
│   ├── TimeTable.svelte  # Main timetable component
│   └── index.ts         # Library exports
├── routes/
│   ├── +layout.svelte   # App layout
│   └── +page.svelte     # Home page
├── app.css             # Global styles and fonts
├── app.html            # HTML template
└── app.d.ts            # Type definitions
```

### Key Components

**TimeTable.svelte** - The main component containing:

- Hard-coded class schedule data in Korean
- Professor color mapping system (`professorColors`)
- Mobile-responsive design with breakpoints at 768px
- localStorage integration for date persistence
- Global console functions (`setCurrentDate`, `resetCurrentDate`)
- Responsive layout that removes padding/margins on mobile

### Design Patterns

**Responsive Design:**

- Mobile-first approach with `md:` prefixes for desktop
- Dynamic class application based on `isMobile` state
- Conditional UI elements (different button styles for mobile/desktop)

**State Management:**

- Local component state using `let` declarations
- localStorage integration for persistent data
- Window event listeners for responsive behavior

**Styling Approach:**

- TailwindCSS utility classes with custom Korean typography
- Color-coded system for professors using Tailwind color palette
- Table-based layout with responsive text sizing
- Custom font loading via CDN (Pretendard font family)

## Development Guidelines

When modifying this project:

- Maintain the mobile-responsive design patterns
- Preserve the color coding system for professors
- Keep the Korean language content and formatting
- Use TailwindCSS classes consistently with the existing pattern
- Test on both mobile and desktop breakpoints
- Follow the existing TypeScript patterns for type safety
