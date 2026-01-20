
export const notificationService = {
  requestPermission: async () => {
    if (!('Notification' in window)) return false;
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  },

  sendNotification: (title: string, body: string) => {
    if (Notification.permission === 'granted') {
      new Notification(title, { 
        body, 
        icon: 'https://cdn-icons-png.flaticon.com/512/906/906334.png' 
      });
    }
  },

  checkReminders: (tasks: any[]) => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    // Get today's date in YYYY-MM-DD format to prevent reminders for past/future days
    const today = now.toISOString().split('T')[0];
    
    tasks.forEach(task => {
      // Ensure the task is for today, is not yet completed, and matches the current time
      if (!task.isDone && task.time === currentTime && task.date === today) {
        notificationService.sendNotification(
          'Task Reminder!',
          `It's time for: ${task.title}`
        );
      }
    });
  }
};
