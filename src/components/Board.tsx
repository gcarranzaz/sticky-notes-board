import { useCallback, useRef, useState, useEffect, memo } from 'react';
import type { Note as NoteType, NoteId, NoteUpdates } from '../state/types';
import { HEADER_HEIGHT } from '../state/types';
import { getRectCenter } from '../utils/geometry';
import { Note } from './Note';
import { TrashZone } from './TrashZone';
import './Board.css';

type TrashHitTest = (x: number, y: number) => boolean;

interface BoardProps {
  readonly notes: readonly NoteType[];
  readonly onUpdate: (id: NoteId, updates: NoteUpdates) => void;
  readonly onDelete: (id: NoteId) => void;
  readonly onBringToFront: (id: NoteId) => void;
}

export const Board = memo(({ notes, onUpdate, onDelete, onBringToFront }: BoardProps) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const trashHitTestRef = useRef<TrashHitTest | null>(null);
  const draggingNoteRef = useRef<{ id: NoteId; width: number; height: number } | null>(null);
  
  const [boardBounds, setBoardBounds] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateBounds = () => {
      if (boardRef.current) {
        setBoardBounds({
          width: boardRef.current.clientWidth,
          height: boardRef.current.clientHeight,
        });
      }
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  const handleRegisterTrashHitTest = useCallback((hitTest: TrashHitTest) => {
    trashHitTestRef.current = hitTest;
  }, []);

  const handleDragStart = useCallback((id: NoteId) => {
    const note = notes.find((n) => n.id === id);
    if (note) {
      draggingNoteRef.current = { id, width: note.width, height: note.height };
    }
  }, [notes]);

  const handleDragMove = useCallback((_id: NoteId, x: number, y: number) => {
    if (!trashHitTestRef.current || !draggingNoteRef.current) return;
    
    // Get center of note for hit testing (accounting for header offset)
    const { width, height } = draggingNoteRef.current;
    const center = getRectCenter(x, y + HEADER_HEIGHT, width, height);
    trashHitTestRef.current(center.x, center.y);
  }, []);

  const handleDragEnd = useCallback((id: NoteId, x: number, y: number) => {
    if (!trashHitTestRef.current || !draggingNoteRef.current) return;

    const { width, height } = draggingNoteRef.current;
    const center = getRectCenter(x, y + HEADER_HEIGHT, width, height);
    
    if (trashHitTestRef.current(center.x, center.y)) {
      onDelete(id);
    }
    
    draggingNoteRef.current = null;
  }, [onDelete]);

  return (
    <div ref={boardRef} className="board">
      {notes.map((note) => (
        <Note
          key={note.id}
          note={note}
          onUpdate={onUpdate}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
          onBringToFront={onBringToFront}
          boardBounds={boardBounds}
        />
      ))}
      <TrashZone onRegisterHitTest={handleRegisterTrashHitTest} />
    </div>
  );
});

Board.displayName = 'Board';
