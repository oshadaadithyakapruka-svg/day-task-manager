
import { Task } from '../types';

const STORAGE_KEY = 'daily_focus_tasks_v1';

export const storageService = {
  getTasks: (): Task[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },
  
  saveTasks: (tasks: Task[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  },

  getTodayDate: () => {
    return new Date().toISOString().split('T')[0];
  }
};
