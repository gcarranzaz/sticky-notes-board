// Branded type for note IDs - provides compile-time safety
export type NoteId = string & { readonly __brand: 'NoteId' };

export interface Note {
  readonly id: NoteId;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  zIndex: number;
}

export interface NotesState {
  readonly notes: readonly Note[];
  readonly maxZIndex: number;
}

export type NoteUpdates = Partial<Omit<Note, 'id'>>;

export type Action =
  | { readonly type: 'ADD_NOTE'; readonly payload: Omit<Note, 'id' | 'zIndex'> }
  | { readonly type: 'UPDATE_NOTE'; readonly payload: { readonly id: NoteId; readonly updates: NoteUpdates } }
  | { readonly type: 'DELETE_NOTE'; readonly payload: { readonly id: NoteId } }
  | { readonly type: 'BRING_TO_FRONT'; readonly payload: { readonly id: NoteId } }
  | { readonly type: 'LOAD_NOTES'; readonly payload: NotesState };

export interface NoteCreationParams {
  readonly width: number;
  readonly height: number;
  readonly color: string;
}

export const NOTE_COLORS = [
  { name: 'Yellow', value: '#ffd966' },
  { name: 'Blue', value: '#93c5fd' },
  { name: 'Green', value: '#a7f3d0' },
  { name: 'Pink', value: '#fda4af' },
  { name: 'Purple', value: '#e9d5ff' },
  { name: 'Orange', value: '#fed7aa' },
] as const;

export const DEFAULT_NOTE_SIZE = { width: 200, height: 200 };
export const MIN_NOTE_SIZE = { width: 100, height: 100 };
export const HEADER_HEIGHT = 70;
