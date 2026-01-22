import { useRef, useState, useCallback, useEffect, memo, type PointerEvent } from 'react';
import type { Note as NoteType, NoteId, NoteUpdates } from '../state/types';
import { MIN_NOTE_SIZE } from '../state/types';
import { calculateResize, clamp } from '../utils/geometry';
import './Note.css';

interface BoardBounds {
  readonly width: number;
  readonly height: number;
}

interface NoteProps {
  readonly note: NoteType;
  readonly onUpdate: (id: NoteId, updates: NoteUpdates) => void;
  readonly onDragStart: (id: NoteId) => void;
  readonly onDragMove: (id: NoteId, x: number, y: number) => void;
  readonly onDragEnd: (id: NoteId, x: number, y: number) => void;
  readonly onBringToFront: (id: NoteId) => void;
  readonly boardBounds: BoardBounds;
}

type ResizeHandle = 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w';

const RESIZE_HANDLES: readonly ResizeHandle[] = ['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'];

interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  noteStartX: number;
  noteStartY: number;
}

interface ResizeState {
  isResizing: boolean;
  handle: ResizeHandle | null;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  startNoteX: number;
  startNoteY: number;
}

// Uses refs for transient drag/resize data to avoid re-renders during interaction
export const Note = memo(({
  note,
  onUpdate,
  onDragStart,
  onDragMove,
  onDragEnd,
  onBringToFront,
  boardBounds,
}: NoteProps) => {
  const noteRef = useRef<HTMLDivElement>(null);
  const pointerIdRef = useRef<number | null>(null);
  
  // Use refs for transient drag/resize data to avoid re-renders during movement
  const dragStateRef = useRef<DragState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    noteStartX: 0,
    noteStartY: 0,
  });
  
  const resizeStateRef = useRef<ResizeState>({
    isResizing: false,
    handle: null,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    startNoteX: 0,
    startNoteY: 0,
  });

  // Visual state for CSS classes only (minimal re-renders)
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const currentPosRef = useRef({ x: note.x, y: note.y });
  
  useEffect(() => {
    currentPosRef.current = { x: note.x, y: note.y };
  }, [note.x, note.y]);

  const constrainPosition = useCallback((x: number, y: number, width: number, height: number) => ({
    x: clamp(x, 0, Math.max(0, boardBounds.width - width)),
    y: clamp(y, 0, Math.max(0, boardBounds.height - height)),
  }), [boardBounds.width, boardBounds.height]);

  // Drag handlers
  const handleDragStart = useCallback((e: PointerEvent<HTMLDivElement>) => {
    // Don't start drag on resize handles or textarea
    const target = e.target as HTMLElement;
    if (
      target.classList.contains('resize-handle') ||
      target.tagName === 'TEXTAREA'
    ) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    if (noteRef.current) {
      noteRef.current.setPointerCapture(e.pointerId);
    }
    pointerIdRef.current = e.pointerId;

    dragStateRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      noteStartX: note.x,
      noteStartY: note.y,
    };

    setIsDragging(true);
    onBringToFront(note.id);
    onDragStart(note.id);
  }, [note.id, note.x, note.y, onBringToFront, onDragStart]);

  const handlePointerMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (dragStateRef.current.isDragging) {
      e.preventDefault();
      
      const { startX, startY, noteStartX, noteStartY } = dragStateRef.current;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      // Calculate new position and constrain to board bounds
      const rawX = noteStartX + deltaX;
      const rawY = noteStartY + deltaY;
      const { x: newX, y: newY } = constrainPosition(rawX, rawY, note.width, note.height);
      
      currentPosRef.current = { x: newX, y: newY };
      onUpdate(note.id, { x: newX, y: newY });
      onDragMove(note.id, newX, newY);
    } else if (resizeStateRef.current.isResizing) {
      e.preventDefault();
      
      const { handle, startX, startY, startWidth, startHeight, startNoteX, startNoteY } = resizeStateRef.current;
      if (!handle) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      const resized = calculateResize(
        startWidth,
        startHeight,
        startNoteX,
        startNoteY,
        deltaX,
        deltaY,
        handle,
        MIN_NOTE_SIZE.width,
        MIN_NOTE_SIZE.height
      );

      // Constrain resized note to board bounds
      const constrained = constrainPosition(resized.x, resized.y, resized.width, resized.height);
      
      currentPosRef.current = { x: constrained.x, y: constrained.y };
      onUpdate(note.id, { 
        width: resized.width, 
        height: resized.height, 
        x: constrained.x, 
        y: constrained.y 
      });
    }
  }, [note.id, note.width, note.height, onUpdate, onDragMove, constrainPosition]);

  const handlePointerUp = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (dragStateRef.current.isDragging) {
      e.preventDefault();
      
      if (noteRef.current && pointerIdRef.current !== null) {
        noteRef.current.releasePointerCapture(pointerIdRef.current);
      }
      pointerIdRef.current = null;

      dragStateRef.current.isDragging = false;
      setIsDragging(false);
      onDragEnd(note.id, currentPosRef.current.x, currentPosRef.current.y);
    } else if (resizeStateRef.current.isResizing) {
      e.preventDefault();
      
      if (noteRef.current && pointerIdRef.current !== null) {
        noteRef.current.releasePointerCapture(pointerIdRef.current);
      }
      pointerIdRef.current = null;

      resizeStateRef.current.isResizing = false;
      resizeStateRef.current.handle = null;
      setIsResizing(false);
    }
  }, [note.id, onDragEnd]);

  // Resize handlers
  const handleResizeStart = useCallback((e: PointerEvent<HTMLDivElement>, handle: ResizeHandle) => {
    e.preventDefault();
    e.stopPropagation();

    if (noteRef.current) {
      noteRef.current.setPointerCapture(e.pointerId);
    }
    pointerIdRef.current = e.pointerId;

    resizeStateRef.current = {
      isResizing: true,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: note.width,
      startHeight: note.height,
      startNoteX: note.x,
      startNoteY: note.y,
    };

    setIsResizing(true);
    onBringToFront(note.id);
  }, [note.id, note.width, note.height, note.x, note.y, onBringToFront]);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(note.id, { text: e.target.value });
  }, [note.id, onUpdate]);

  return (
    <div
      ref={noteRef}
      className={`note ${isDragging ? 'dragging' : ''} ${isResizing ? 'resizing' : ''}`}
      style={{
        left: `${note.x}px`,
        top: `${note.y}px`,
        width: `${note.width}px`,
        height: `${note.height}px`,
        backgroundColor: note.color,
        zIndex: note.zIndex,
      }}
      onPointerDown={handleDragStart}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div className="note-header" />
      <textarea
        className="note-content"
        value={note.text}
        onChange={handleTextChange}
        placeholder="Write your note..."
        onPointerDown={(e) => e.stopPropagation()}
      />

      {/* Resize handles */}
      {RESIZE_HANDLES.map((handle) => (
        <div
          key={handle}
          className={`resize-handle ${handle}`}
          onPointerDown={(e) => handleResizeStart(e, handle)}
        />
      ))}
    </div>
  );
});

Note.displayName = 'Note';
