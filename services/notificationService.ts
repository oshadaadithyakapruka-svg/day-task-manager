
export const notificationService = {
  requestPermission: async () => {
    if (!('Notification' in window)) return false;
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  },

  sendNotification: (title: string, body: string) => {
    if (Notification.permission === 'granted') {
      new Notification(title, { body, icon: 'https://picsum.photos/100/100' });
    }
  },

  checkReminders: (tasks: any[]) => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    tasks.forEach(task => {
      if (!task.isDone && task.time === currentTime) {
        notificationService.sendNotification(
          'Task Reminder!',
          `It's time for: ${task.title}`
        );
      }
    });
  }
};
