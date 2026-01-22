import { useState, memo, useCallback } from 'react';
import { NOTE_COLORS, DEFAULT_NOTE_SIZE, MIN_NOTE_SIZE, type NoteCreationParams } from '../state/types';
import './Toolbar.css';

interface ToolbarProps {
  readonly onStartCreation: (params: NoteCreationParams) => void;
  readonly isCreating: boolean;
  readonly onCancelCreation: () => void;
}

const MAX_NOTE_SIZE = 600;

export const Toolbar = memo(({ onStartCreation, isCreating, onCancelCreation }: ToolbarProps) => {
  const [width, setWidth] = useState(DEFAULT_NOTE_SIZE.width);
  const [height, setHeight] = useState(DEFAULT_NOTE_SIZE.height);
  const [selectedColor, setSelectedColor] = useState<string>(NOTE_COLORS[0].value);

  const handleWidthChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setWidth(Math.max(MIN_NOTE_SIZE.width, parseInt(e.target.value) || MIN_NOTE_SIZE.width));
  }, []);

  const handleHeightChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setHeight(Math.max(MIN_NOTE_SIZE.height, parseInt(e.target.value) || MIN_NOTE_SIZE.height));
  }, []);

  const handleCreate = useCallback(() => {
    onStartCreation({ width, height, color: selectedColor });
  }, [onStartCreation, width, height, selectedColor]);

  return (
    <header className="toolbar">
      <h1 className="toolbar-title">📝 Sticky Notes</h1>

      <div className="toolbar-controls">
        <div className="size-control">
          <label>
            W:
            <input
              type="number"
              value={width}
              onChange={handleWidthChange}
              min={MIN_NOTE_SIZE.width}
              max={MAX_NOTE_SIZE}
              step={25}
            />
          </label>
          <label>
            H:
            <input
              type="number"
              value={height}
              onChange={handleHeightChange}
              min={MIN_NOTE_SIZE.height}
              max={MAX_NOTE_SIZE}
              step={25}
            />
          </label>
        </div>

        <div className="color-picker">
          {NOTE_COLORS.map((color) => (
            <button
              key={color.value}
              className={`color-swatch ${selectedColor === color.value ? 'selected' : ''}`}
              style={{ backgroundColor: color.value }}
              onClick={() => setSelectedColor(color.value)}
              title={color.name}
              aria-label={`Select ${color.name} color`}
            />
          ))}
        </div>

        {isCreating ? (
          <button className="create-btn cancel" onClick={onCancelCreation}>
            ✕ Cancel
          </button>
        ) : (
          <button className="create-btn" onClick={handleCreate}>
            + Add Note
          </button>
        )}
      </div>

      {isCreating && (
        <div className="creation-hint">
          Click anywhere on the board to place the note
        </div>
      )}
    </header>
  );
});

Toolbar.displayName = 'Toolbar';
