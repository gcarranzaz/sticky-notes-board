# Sticky Notes Board

A React + TypeScript Single Page Application (SPA) for creating and managing sticky notes with drag and resize functionality.

## Features

- **Create Notes**: Add sticky notes with random colors and positions
- **Drag to Move**: Move notes using Pointer Events with pointer capture
- **Resize**: Resize notes using corner and edge handles
- **Delete**: Drag notes to the trash zone to delete them
- **No External Libraries**: Built without UI component libraries or drag/resize libraries

## Architecture

### State Management
- Uses **useReducer** hook with typed actions for predictable state updates
- Three action types: `ADD_NOTE`, `UPDATE_NOTE`, `DELETE_NOTE`
- Centralized state in `reducer.ts` with TypeScript types defined in `types.ts`

### Components

#### `App.tsx`
- Main component that manages the global state using `useReducer`
- Provides callbacks for note operations (add, update, delete)
- Handles drag-end logic to check if note should be deleted

#### `StickyNote.tsx`
- Individual note component with drag and resize functionality
- **Pointer Events API** with pointer capture for smooth interactions
- Supports 8 resize handles (4 corners + 4 edges)
- Textarea for note content that prevents drag when editing

#### `TrashZone.tsx`
- Fixed position trash area for deleting notes
- Visual feedback (highlight) when a note is dragged over it
- Located at bottom-right corner

### Interaction Model

#### Dragging
- Uses `setPointerCapture()` to ensure smooth dragging even when cursor moves fast
- Pointer down → capture → pointer move → update position → pointer up → release
- Prevents text selection during drag

#### Resizing
- 8 resize handles: nw, ne, sw, se (corners) + n, s, e, w (edges)
- Maintains minimum size of 100x100 pixels
- Updates both size and position when resizing from top/left edges

#### Deletion
- Drag note to trash zone in bottom-right corner
- Trash zone highlights when note is over it
- Note is deleted on drag end if dropped in trash zone

## Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Technology Stack

- **React 19**: UI framework
- **TypeScript**: Type safety and better developer experience
- **Vite**: Fast build tool and dev server
- **CSS3**: Styling without CSS frameworks

## Key Implementation Details

### Pointer Events
Instead of mouse events, this app uses the Pointer Events API which:
- Works with mouse, touch, and pen inputs
- Provides pointer capture for uninterrupted event streams
- Better performance than mouse events

### Type Safety
All actions, state, and props are fully typed with TypeScript:
```typescript
export type Action =
  | { type: 'ADD_NOTE'; payload: Omit<Note, 'id'> }
  | { type: 'UPDATE_NOTE'; payload: { id: string; updates: Partial<Note> } }
  | { type: 'DELETE_NOTE'; payload: { id: string } };
```

### No External Drag Libraries
All drag and resize functionality is implemented from scratch using:
- Native Pointer Events API
- `setPointerCapture()` / `releasePointerCapture()`
- Manual position and size calculations

## License

MIT License - see LICENSE file for details
