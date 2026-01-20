
import React, { useState, useEffect, useMemo } from 'react';
import { Task, View } from './types';
import { storageService } from './services/storageService';
import { notificationService } from './services/notificationService';
import { Button } from './components/Button';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentView, setCurrentView] = useState<View>('home');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('12:00');
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>('default');

  // Load tasks on mount
  useEffect(() => {
    const saved = storageService.getTasks();
    setTasks(saved);
    
    if ('Notification' in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  // Sync tasks to local storage
  useEffect(() => {
    storageService.saveTasks(tasks);
  }, [tasks]);

  // Check reminders every minute
  useEffect(() => {
    const interval = setInterval(() => {
      notificationService.checkReminders(tasks);
    }, 60000); // Check every 60 seconds
    return () => clearInterval(interval);
  }, [tasks]);

  const today = storageService.getTodayDate();

  const todayTasks = useMemo(() => {
    return tasks
      .filter(t => t.date === today)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [tasks, today]);

  const completedCount = todayTasks.filter(t => t.isDone).length;
  const totalCount = todayTasks.length;

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle,
      time: newTaskTime,
      isDone: false,
      date: today
    };

    setTasks(prev => [...prev, newTask]);
    setNewTaskTitle('');
    setCurrentView('home');
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, isDone: !t.isDone } : t
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const requestNotifs = async () => {
    const granted = await notificationService.requestPermission();
    if (granted) setNotifPermission('granted');
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white shadow-xl relative overflow-hidden flex flex-col">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Today</h1>
            <p className="text-gray-500 font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="text-right">
             <div className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              {completedCount} / {totalCount} Done
             </div>
          </div>
        </div>
        
        {/* Simple Progress Bar */}
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
          />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-6 py-4 overflow-y-auto no-scrollbar">
        {currentView === 'home' ? (
          <div className="space-y-4 pb-24">
            {todayTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-xl font-medium">No tasks for today yet.</p>
                <p className="text-sm">Tap the button below to start!</p>
              </div>
            ) : (
              todayTasks.map(task => (
                <div 
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`group relative flex items-center p-5 rounded-2xl border transition-all cursor-pointer select-none
                    ${task.isDone 
                      ? 'bg-gray-50 border-gray-100 opacity-60' 
                      : 'bg-white border-gray-200 shadow-sm hover:shadow-md active:bg-gray-50'}`}
                >
                  <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center mr-4 transition-colors
                    ${task.isDone ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300'}`}>
                    {task.isDone && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-lg font-semibold ${task.isDone ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                      {task.title}
                    </p>
                    <p className={`text-sm ${task.isDone ? 'text-gray-400' : 'text-indigo-500 font-medium'}`}>
                      {task.time}
                    </p>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                    className="p-2 text-gray-300 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))
            )}

            {notifPermission !== 'granted' && (
              <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-center">
                <p className="text-amber-800 text-sm font-medium mb-2">Want reminders at task time?</p>
                <button 
                  onClick={requestNotifs}
                  className="text-amber-900 underline text-sm font-bold"
                >
                  Enable Notifications
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
            <div>
              <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">What do you want to do?</label>
              <input 
                autoFocus
                type="text"
                placeholder="e.g. Morning Yoga"
                className="w-full text-2xl font-bold p-0 border-none focus:ring-0 placeholder-gray-300"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">At what time?</label>
              <input 
                type="time"
                className="w-full text-3xl font-bold p-0 border-none focus:ring-0 bg-transparent"
                value={newTaskTime}
                onChange={(e) => setNewTaskTime(e.target.value)}
              />
            </div>

            <div className="pt-4 space-y-3">
              <Button fullWidth onClick={handleAddTask}>Save Task</Button>
              <Button fullWidth variant="secondary" onClick={() => setCurrentView('home')}>Cancel</Button>
            </div>
          </div>
        )}
      </main>

      {/* Persistent Call-to-Action */}
      {currentView === 'home' && (
        <div className="absolute bottom-8 right-8 z-20">
          <button 
            onClick={() => setCurrentView('add')}
            className="w-16 h-16 bg-indigo-600 rounded-full shadow-2xl shadow-indigo-300 text-white flex items-center justify-center transform transition-transform active:scale-90"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
