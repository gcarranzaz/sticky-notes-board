import type { Note, Action } from './types';

export const notesReducer = (state: Note[], action: Action): Note[] => {
  switch (action.type) {
    case 'ADD_NOTE':
      return [
        ...state,
        {
          ...action.payload,
          id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
        },
      ];
    case 'UPDATE_NOTE':
      return state.map((note) =>
        note.id === action.payload.id
          ? { ...note, ...action.payload.updates }
          : note
      );
    case 'DELETE_NOTE':
      return state.filter((note) => note.id !== action.payload.id);
    default:
      return state;
  }
};
