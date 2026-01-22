export interface Note {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export type Action =
  | { type: 'ADD_NOTE'; payload: Omit<Note, 'id'> }
  | { type: 'UPDATE_NOTE'; payload: { id: string; updates: Partial<Note> } }
  | { type: 'DELETE_NOTE'; payload: { id: string } };
