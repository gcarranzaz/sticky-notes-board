import { useRef, useState, type PointerEvent } from 'react';
import type { Note } from './types';
import './StickyNote.css';

interface StickyNoteProps {
  note: Note;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onDragStart: (id: string) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
}

type ResizeHandle = 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w' | null;

export const StickyNote = ({ note, onUpdate, onDragStart, onDragEnd }: StickyNoteProps) => {
  const noteRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle>(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, noteX: 0, noteY: 0 });

  const handlePointerDownDrag = (e: PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).classList.contains('resize-handle')) {
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    
    setIsDragging(true);
    setDragStart({ x: e.clientX - note.x, y: e.clientY - note.y });
    onDragStart(note.id);
  };

  const handlePointerMoveDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    e.preventDefault();
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    onUpdate(note.id, { x: newX, y: newY });
  };

  const handlePointerUpDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    e.preventDefault();
    const target = e.currentTarget;
    target.releasePointerCapture(e.pointerId);
    
    setIsDragging(false);
    onDragEnd(note.id, note.x, note.y);
  };

  const handlePointerDownResize = (e: PointerEvent<HTMLDivElement>, handle: ResizeHandle) => {
    e.preventDefault();
    e.stopPropagation();
    
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    
    setIsResizing(true);
    setResizeHandle(handle);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: note.width,
      height: note.height,
      noteX: note.x,
      noteY: note.y,
    });
  };

  const handlePointerMoveResize = (e: PointerEvent<HTMLDivElement>) => {
    if (!isResizing || !resizeHandle) return;
    
    e.preventDefault();
    
    const deltaX = e.clientX - resizeStart.x;
    const deltaY = e.clientY - resizeStart.y;
    
    let newWidth = resizeStart.width;
    let newHeight = resizeStart.height;
    let newX = note.x;
    let newY = note.y;
    
    // Handle horizontal resize
    if (resizeHandle.includes('e')) {
      newWidth = Math.max(100, resizeStart.width + deltaX);
    } else if (resizeHandle.includes('w')) {
      newWidth = Math.max(100, resizeStart.width - deltaX);
      newX = resizeStart.noteX + (resizeStart.width - newWidth);
    }
    
    // Handle vertical resize
    if (resizeHandle.includes('s')) {
      newHeight = Math.max(100, resizeStart.height + deltaY);
    } else if (resizeHandle.includes('n')) {
      newHeight = Math.max(100, resizeStart.height - deltaY);
      newY = resizeStart.noteY + (resizeStart.height - newHeight);
    }
    
    onUpdate(note.id, { width: newWidth, height: newHeight, x: newX, y: newY });
  };

  const handlePointerUpResize = (e: PointerEvent<HTMLDivElement>) => {
    if (!isResizing) return;
    
    e.preventDefault();
    const target = e.currentTarget;
    target.releasePointerCapture(e.pointerId);
    
    setIsResizing(false);
    setResizeHandle(null);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(note.id, { text: e.target.value });
  };

  return (
    <div
      ref={noteRef}
      className={`sticky-note ${isDragging ? 'dragging' : ''} ${isResizing ? 'resizing' : ''}`}
      style={{
        left: `${note.x}px`,
        top: `${note.y}px`,
        width: `${note.width}px`,
        height: `${note.height}px`,
        backgroundColor: note.color,
      }}
      onPointerDown={handlePointerDownDrag}
      onPointerMove={isResizing ? handlePointerMoveResize : handlePointerMoveDrag}
      onPointerUp={isResizing ? handlePointerUpResize : handlePointerUpDrag}
    >
      <textarea
        className="note-text"
        value={note.text}
        onChange={handleTextChange}
        placeholder="Type your note..."
        onPointerDown={(e) => e.stopPropagation()}
      />
      
      {/* Corner handles */}
      <div
        className="resize-handle nw"
        onPointerDown={(e) => handlePointerDownResize(e, 'nw')}
      />
      <div
        className="resize-handle ne"
        onPointerDown={(e) => handlePointerDownResize(e, 'ne')}
      />
      <div
        className="resize-handle sw"
        onPointerDown={(e) => handlePointerDownResize(e, 'sw')}
      />
      <div
        className="resize-handle se"
        onPointerDown={(e) => handlePointerDownResize(e, 'se')}
      />
      
      {/* Edge handles */}
      <div
        className="resize-handle n"
        onPointerDown={(e) => handlePointerDownResize(e, 'n')}
      />
      <div
        className="resize-handle s"
        onPointerDown={(e) => handlePointerDownResize(e, 's')}
      />
      <div
        className="resize-handle e"
        onPointerDown={(e) => handlePointerDownResize(e, 'e')}
      />
      <div
        className="resize-handle w"
        onPointerDown={(e) => handlePointerDownResize(e, 'w')}
      />
    </div>
  );
};
