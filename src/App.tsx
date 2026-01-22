import { useReducer, useCallback, useRef } from 'react';
import { StickyNote } from './StickyNote';
import { TrashZone } from './TrashZone';
import { notesReducer } from './reducer';
import type { Note } from './types';
import './App.css';

const COLORS = ['#ffd966', '#93c5fd', '#a7f3d0', '#fda4af', '#e9d5ff'];

function App() {
  const [notes, dispatch] = useReducer(notesReducer, []);
  const trashCheckRef = useRef<((x: number, y: number) => boolean) | null>(null);

  const addNote = useCallback(() => {
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const randomX = Math.random() * (window.innerWidth - 250) + 50;
    const randomY = Math.random() * (window.innerHeight - 250) + 50;
    
    dispatch({
      type: 'ADD_NOTE',
      payload: {
        text: '',
        x: randomX,
        y: randomY,
        width: 200,
        height: 200,
        color: randomColor,
      },
    });
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    dispatch({
      type: 'UPDATE_NOTE',
      payload: { id, updates },
    });
  }, []);

  const deleteNote = useCallback((id: string) => {
    dispatch({
      type: 'DELETE_NOTE',
      payload: { id },
    });
  }, []);

  const handleDragStart = useCallback(() => {
    // Note is being dragged
  }, []);

  const handleDragEnd = useCallback((id: string, x: number, y: number) => {
    // Check if note is dropped in trash zone
    if (trashCheckRef.current && trashCheckRef.current(x + 100, y + 100)) {
      deleteNote(id);
    }
  }, [deleteNote]);

  const handleRegisterTrashCheck = useCallback((checkFn: (x: number, y: number) => boolean) => {
    trashCheckRef.current = checkFn;
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>📝 Sticky Notes Board</h1>
        <button className="add-note-btn" onClick={addNote}>
          + Add Note
        </button>
      </header>
      
      <div className="notes-container">
        {notes.map((note) => (
          <StickyNote
            key={note.id}
            note={note}
            onUpdate={updateNote}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>
      
      <TrashZone onRegisterCheck={handleRegisterTrashCheck} />
    </div>
  );
}

export default App;
