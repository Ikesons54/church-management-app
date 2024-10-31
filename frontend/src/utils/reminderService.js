import { notification } from 'antd';
import moment from 'moment';
import { checkMemberCompletion } from './memberVerification';

export const ReminderService = {
  getConfig: () => {
    const defaultConfig = {
      frequency: 7,
      frequencyUnit: 'days',
      enabled: true,
      reminderType: ['notification', 'email'],
      maxReminders: 3,
      reminderTime: '09:00'
    };

    const savedConfig = localStorage.getItem('reminderConfig');
    return savedConfig ? JSON.parse(savedConfig) : defaultConfig;
  },

  checkAndSendReminders: async (member) => {
    try {
      const config = ReminderService.getConfig();
      if (!config.enabled) return;

      const lastReminder = localStorage.getItem(`lastReminder_${member.memberId}`);
      const reminderCount = parseInt(localStorage.getItem(`reminderCount_${member.memberId}`) || '0');
      const today = moment();
      
      // Check if we've exceeded max reminders
      if (reminderCount >= config.maxReminders) {
        return;
      }

      // Calculate next reminder date based on configuration
      const nextReminderDue = lastReminder ? 
        moment(lastReminder).add(config.frequency, config.frequencyUnit) : 
        today;

      if (!lastReminder || today.isAfter(nextReminderDue)) {
        const status = checkMemberCompletion(member);
        
        if (!status.isComplete) {
          // Send reminders based on configured methods
          if (config.reminderType.includes('notification')) {
            notification.info({
              message: 'Profile Incomplete',
              description: `Please complete your profile. Missing: ${status.missingFields.join(', ')}`,
              duration: 0,
              key: `reminder_${member.memberId}`
            });
          }

          if (config.reminderType.includes('email')) {
            await fetch('http://localhost:5000/api/members/send-reminder', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({ 
                memberId: member.memberId,
                missingFields: status.missingFields,
                reminderType: 'email'
              })
            });
          }

          if (config.reminderType.includes('sms')) {
            await fetch('http://localhost:5000/api/members/send-reminder', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({ 
                memberId: member.memberId,
                missingFields: status.missingFields,
                reminderType: 'sms'
              })
            });
          }

          // Update reminder tracking
          localStorage.setItem(`lastReminder_${member.memberId}`, today.toISOString());
          localStorage.setItem(`reminderCount_${member.memberId}`, (reminderCount + 1).toString());
        }
      }
    } catch (error) {
      console.error('Error in checkAndSendReminders:', error);
      notification.error({
        message: 'Reminder Error',
        description: 'Failed to send reminder. Please try again later.',
        duration: 3
      });
    }
  },

  resetReminderCount: (memberId) => {
    localStorage.removeItem(`reminderCount_${memberId}`);
  },

  clearReminderHistory: (memberId) => {
    localStorage.removeItem(`lastReminder_${memberId}`);
    localStorage.removeItem(`reminderCount_${memberId}`);
  },

  isReminderDue: (memberId) => {
    const config = ReminderService.getConfig();
    if (!config.enabled) return false;

    const lastReminder = localStorage.getItem(`lastReminder_${memberId}`);
    const reminderCount = parseInt(localStorage.getItem(`reminderCount_${memberId}`) || '0');
    
    if (reminderCount >= config.maxReminders) return false;
    if (!lastReminder) return true;
    
    const nextReminderDue = moment(lastReminder).add(config.frequency, config.frequencyUnit);
    return moment().isAfter(nextReminderDue);
  }
}; 