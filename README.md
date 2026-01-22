# Sticky Notes Board

A React + TypeScript SPA for managing sticky notes with drag, resize, and delete functionality. Built without external UI or drag libraries.

## Quick Start

```bash
npm install
npm run dev     # Development server at http://localhost:5173
npm run build   # Production build
```

**Requirements:** Node.js v18+. Optimized for desktop (Chrome, Firefox, Edge) at 1024×768+.

---

## Architecture

The application follows a **unidirectional data flow** pattern with clear separation between state management, UI components, and utility functions. The core state is managed via `useReducer` with a discriminated union action type, ensuring type-safe state transitions. All notes live in a centralized state object (`NotesState`) that includes z-index tracking for proper layering. Components receive data as props and communicate changes upward via callbacks, making the data flow predictable and easy to debug.

For **performance optimization**, the app uses React's `memo` for all presentational components and stores transient interaction data (drag/resize coordinates) in refs rather than state to avoid unnecessary re-renders during high-frequency pointer events. The Pointer Events API with `setPointerCapture` ensures smooth drag operations even when the cursor moves outside the element. Persistence to localStorage is debounced (500ms) to prevent excessive writes during rapid interactions.

The **component hierarchy** is flat and purposeful: `App` owns the state and delegates rendering to `Board` (note container with trash zone integration), `Toolbar` (creation controls), and `NoteCreator` (placement overlay). Each `Note` component handles its own pointer interactions with 8 resize handles. Type safety is enforced throughout with branded types for note IDs (`NoteId`) and readonly modifiers on props and state, eliminating `any` usage entirely.

---

## Features

| Core | Bonus |
|------|-------|
| ✅ Create with size/position | ✅ Edit text inline |
| ✅ Resize (8 handles) | ✅ Bring to front (z-index) |
| ✅ Drag to move | ✅ localStorage persistence |
| ✅ Drag to trash | ✅ Color selection (6 colors) |
| | ✅ Mock REST API |

---

## Project Structure

```
src/
├── components/        # UI components (memo'd)
│   ├── Board.tsx      # Canvas + trash zone integration
│   ├── Note.tsx       # Drag/resize via Pointer Events
│   ├── NoteCreator.tsx
│   ├── Toolbar.tsx
│   └── TrashZone.tsx
├── state/             # State layer
│   ├── types.ts       # Branded types, interfaces
│   ├── reducer.ts     # Pure reducer function
│   └── persistence.ts # localStorage + mock API
├── utils/
│   └── geometry.ts    # Pure geometry functions
└── App.tsx            # State orchestrator
```

---

## Tech Stack

- **React 19** + **TypeScript** (strict mode, no `any`)
- **Vite** for build tooling
- **Pointer Events API** (no drag libraries)
- **CSS3** (no frameworks)

---

## License

MIT
