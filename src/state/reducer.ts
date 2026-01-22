import type { Note, NoteId, NotesState, Action } from './types';

const generateId = (): NoteId => 
  `note-${Date.now()}-${Math.random().toString(36).slice(2, 11)}` as NoteId;

export const initialState: NotesState = {
  notes: [],
  maxZIndex: 0,
};

export const notesReducer = (state: NotesState, action: Action): NotesState => {
  switch (action.type) {
    case 'ADD_NOTE': {
      const newZIndex = state.maxZIndex + 1;
      const newNote: Note = {
        ...action.payload,
        id: generateId(),
        zIndex: newZIndex,
      };
      return {
        notes: [...state.notes, newNote],
        maxZIndex: newZIndex,
      };
    }

    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map((note) =>
          note.id === action.payload.id
            ? { ...note, ...action.payload.updates }
            : note
        ),
      };

    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter((note) => note.id !== action.payload.id),
      };

    case 'BRING_TO_FRONT': {
      const newZIndex = state.maxZIndex + 1;
      return {
        maxZIndex: newZIndex,
        notes: state.notes.map((note) =>
          note.id === action.payload.id
            ? { ...note, zIndex: newZIndex }
            : note
        ),
      };
    }

    case 'LOAD_NOTES':
      return action.payload;

    default:
      return state;
  }
};
