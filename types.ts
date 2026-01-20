
export interface Task {
  id: string;
  title: string;
  time: string; // HH:mm format
  isDone: boolean;
  date: string; // YYYY-MM-DD
}

export type View = 'home' | 'add';
