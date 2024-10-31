import { notification, Button, Space } from 'antd';
import moment from 'moment';

class ReminderService {
  constructor() {
    this.checkInterval = null;
    this.subscribers = new Set();
    this.reminders = JSON.parse(localStorage.getItem('serviceReminders')) || [];
  }

  init() {
    // Check for reminders every 5 minutes
    this.checkInterval = setInterval(() => {
      this.checkReminders();
    }, 300000);

    // Initial check
    this.checkReminders();
  }

  async checkReminders() {
    try {
      const response = await fetch('/api/reminders/pending');
      const reminders = await response.json();

      reminders.forEach(reminder => {
        this.showReminder(reminder);
      });
    } catch (error) {
      console.error('Error checking reminders:', error);
    }
  }

  showReminder(reminder) {
    notification.info({
      message: reminder.title,
      description: reminder.description,
      duration: 0,
      key: `reminder-${reminder.id}`,
      btn: (
        <Space>
          <Button size="small" onClick={() => this.handleReminder(reminder.id, 'complete')}>
            Mark Complete
          </Button>
          <Button size="small" onClick={() => this.handleReminder(reminder.id, 'snooze')}>
            Snooze
          </Button>
        </Space>
      )
    });
  }

  async handleReminder(reminderId, action) {
    try {
      await fetch(`/api/reminders/${reminderId}/${action}`, {
        method: 'POST'
      });
      notification.close(`reminder-${reminderId}`);
    } catch (error) {
      console.error('Error handling reminder:', error);
    }
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  destroy() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
    this.subscribers.clear();
  }

  scheduleReminders() {
    // Implementation for scheduling reminders
    this.reminders.forEach(reminder => {
      const serviceTime = moment(reminder.serviceTime, 'HH:mm');
      const reminderTime = moment(serviceTime).subtract(reminder.reminderTime, 'minutes');
      
      if (reminderTime.isAfter(moment())) {
        setTimeout(() => {
          this.showReminder({
            id: reminder.id,
            title: `Service Reminder: ${reminder.serviceName}`,
            description: `Service starts in ${reminder.reminderTime} minutes`
          });
        }, reminderTime.diff(moment()));
      }
    });
  }
}

export default new ReminderService(); 