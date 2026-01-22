import { useState, useEffect, useRef, useCallback, memo } from 'react';
import './TrashZone.css';

type HitTestFn = (x: number, y: number) => boolean;

interface TrashZoneProps {
  readonly onRegisterHitTest: (hitTest: HitTestFn) => void;
}

export const TrashZone = memo(({ onRegisterHitTest }: TrashZoneProps) => {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const trashRef = useRef<HTMLDivElement>(null);

  const hitTest = useCallback((x: number, y: number): boolean => {
    if (!trashRef.current) return false;

    const rect = trashRef.current.getBoundingClientRect();
    const isOver =
      x >= rect.left &&
      x <= rect.right &&
      y >= rect.top &&
      y <= rect.bottom;

    setIsHighlighted(isOver);
    return isOver;
  }, []);

  useEffect(() => {
    onRegisterHitTest(hitTest);
  }, [onRegisterHitTest, hitTest]);

  // Reset highlight on pointer up anywhere
  useEffect(() => {
    const handlePointerUp = () => {
      setIsHighlighted(false);
    };

    window.addEventListener('pointerup', handlePointerUp);
    return () => window.removeEventListener('pointerup', handlePointerUp);
  }, []);

  return (
    <div
      ref={trashRef}
      className={`trash-zone ${isHighlighted ? 'highlighted' : ''}`}
      aria-label="Trash zone - drop notes here to delete"
    >
      <div className="trash-icon">🗑️</div>
      <div className="trash-text">Drop to delete</div>
    </div>
  );
});

TrashZone.displayName = 'TrashZone';
