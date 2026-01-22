import { useState, useEffect } from 'react';
import './TrashZone.css';

interface TrashZoneProps {
  onRegisterCheck: (checkFn: (x: number, y: number) => boolean) => void;
}

export const TrashZone = ({ onRegisterCheck }: TrashZoneProps) => {
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    // This will be triggered from the parent when dragging
    const checkIfOver = (x: number, y: number) => {
      const trashElement = document.querySelector('.trash-zone');
      if (!trashElement) return false;
      
      const rect = trashElement.getBoundingClientRect();
      const isOver = (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
      );
      
      setIsHighlighted(isOver);
      return isOver;
    };

    // Register the check function with parent
    onRegisterCheck(checkIfOver);
  }, [onRegisterCheck]);

  return (
    <div className={`trash-zone ${isHighlighted ? 'highlighted' : ''}`}>
      <div className="trash-icon">🗑️</div>
      <div className="trash-text">Drop here to delete</div>
    </div>
  );
};
