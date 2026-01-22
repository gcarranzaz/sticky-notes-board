import { useRef, useEffect, useCallback, memo, type PointerEvent } from 'react';
import type { NoteCreationParams } from '../state/types';
import { HEADER_HEIGHT } from '../state/types';
import './NoteCreator.css';

interface NoteCreatorProps {
  readonly params: NoteCreationParams;
  readonly onPlace: (x: number, y: number, params: NoteCreationParams) => void;
  readonly onCancel: () => void;
}

// Overlay for placing new notes - shows a ghost preview following the cursor
export const NoteCreator = memo(({ params, onPlace, onCancel }: NoteCreatorProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const preview = previewRef.current;
    if (!overlay || !preview) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX - params.width / 2;
      const y = e.clientY - params.height / 2;
      preview.style.left = `${x}px`;
      preview.style.top = `${y}px`;
      preview.style.opacity = '1';
    };

    overlay.addEventListener('mousemove', handleMouseMove);
    return () => overlay.removeEventListener('mousemove', handleMouseMove);
  }, [params.width, params.height]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const handleClick = useCallback((e: PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const x = Math.max(0, e.clientX - params.width / 2);
    const y = Math.max(0, e.clientY - params.height / 2 - HEADER_HEIGHT);
    onPlace(x, y, params);
  }, [params, onPlace]);

  return (
    <div 
      ref={overlayRef}
      className="note-creator-overlay"
      onPointerDown={handleClick}
    >
      <div
        ref={previewRef}
        className="note-preview"
        style={{
          width: `${params.width}px`,
          height: `${params.height}px`,
          backgroundColor: params.color,
          opacity: 0,
        }}
      >
        <div className="preview-header" />
        <div className="preview-content">Click to place</div>
      </div>
    </div>
  );
});

NoteCreator.displayName = 'NoteCreator';
