import { useReducer, useCallback, useState, useEffect, useMemo } from 'react';
import { Board, Toolbar, NoteCreator } from './components';
import {
  notesReducer,
  initialState,
  loadFromLocalStorage,
  createDebouncedSave,
  type NoteCreationParams,
  type NoteUpdates,
  type NoteId,
} from './state';
import './App.css';

function App() {
  const [state, dispatch] = useReducer(notesReducer, initialState, loadFromLocalStorage);
  const [creationParams, setCreationParams] = useState<NoteCreationParams | null>(null);

  const debouncedSave = useMemo(() => createDebouncedSave(500), []);

  useEffect(() => {
    debouncedSave(state);
  }, [state, debouncedSave]);

  const handleStartCreation = useCallback((params: NoteCreationParams) => {
    setCreationParams(params);
  }, []);

  const handleCancelCreation = useCallback(() => {
    setCreationParams(null);
  }, []);

  const handlePlaceNote = useCallback((x: number, y: number, params: NoteCreationParams) => {
    dispatch({
      type: 'ADD_NOTE',
      payload: {
        text: '',
        x,
        y,
        width: params.width,
        height: params.height,
        color: params.color,
      },
    });
    setCreationParams(null);
  }, []);

  const handleUpdateNote = useCallback((id: NoteId, updates: NoteUpdates) => {
    dispatch({ type: 'UPDATE_NOTE', payload: { id, updates } });
  }, []);

  const handleDeleteNote = useCallback((id: NoteId) => {
    dispatch({ type: 'DELETE_NOTE', payload: { id } });
  }, []);

  const handleBringToFront = useCallback((id: NoteId) => {
    dispatch({ type: 'BRING_TO_FRONT', payload: { id } });
  }, []);

  return (
    <div className="app">
      <Toolbar
        onStartCreation={handleStartCreation}
        isCreating={creationParams !== null}
        onCancelCreation={handleCancelCreation}
      />
      
      <Board
        notes={state.notes}
        onUpdate={handleUpdateNote}
        onDelete={handleDeleteNote}
        onBringToFront={handleBringToFront}
      />

      {creationParams && (
        <NoteCreator
          params={creationParams}
          onPlace={handlePlaceNote}
          onCancel={handleCancelCreation}
        />
      )}
    </div>
  );
}

export default App;
