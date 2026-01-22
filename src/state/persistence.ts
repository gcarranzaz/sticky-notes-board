import type { NotesState } from './types';
import { initialState } from './reducer';

const STORAGE_KEY = 'sticky-notes-board';
const MOCK_API_DELAY = 300;

export const saveToLocalStorage = (state: NotesState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const loadFromLocalStorage = (): NotesState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as NotesState;
      if (parsed.notes && Array.isArray(parsed.notes)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
  }
  return initialState;
};

// Mock REST API for async operations simulation
export const mockApi = {
  fetchNotes: (): Promise<NotesState> =>
    new Promise((resolve) => setTimeout(() => resolve(loadFromLocalStorage()), MOCK_API_DELAY)),

  saveNotes: (state: NotesState): Promise<{ success: boolean }> =>
    new Promise((resolve) => {
      setTimeout(() => {
        saveToLocalStorage(state);
        resolve({ success: true });
      }, MOCK_API_DELAY);
    }),

  createNote: (_note: Omit<NotesState['notes'][number], 'id'>): Promise<{ id: string }> =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({ id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 11)}` });
      }, MOCK_API_DELAY);
    }),

  deleteNote: (_id: string): Promise<{ success: boolean }> =>
    new Promise((resolve) => setTimeout(() => resolve({ success: true }), MOCK_API_DELAY)),
};

export const createDebouncedSave = (delay = 500) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return (state: NotesState): void => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => saveToLocalStorage(state), delay);
  };
};
