import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export class LocalNotificationService {
  static async requestPermissions() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('reminders', {
        name: 'Daily Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#D9A05B',
      });
    }
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  }

  static async scheduleMorningIntention() {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return;

    // Schedule for 8:00 AM every day
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '☀️ Good morning',
        body: 'What is your intention for today? Take 2 minutes to set it now.',
        sound: 'default',
        data: { type: 'REMINDER_MORNING' }
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 8,
        minute: 0,
      },
    });
    console.log('Scheduled morning intention notification for 8:00 AM');
  }

  static async scheduleEveningReflection() {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return;

    // Schedule for 9:00 PM every day
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌙 Evening Reflection',
        body: 'It’s time to wind down. What brought you peace today? Add it to your gratitude journal.',
        sound: 'default',
        data: { type: 'REMINDER_EVENING' }
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 21,
        minute: 0,
      },
    });
    console.log('Scheduled evening reflection notification for 9:00 PM');
  }

  static async scheduleRandomMindfulnessPause() {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return;

    // Schedule a random time between 12 PM and 5 PM
    const hour = Math.floor(Math.random() * (17 - 12 + 1)) + 12;
    const minute = Math.floor(Math.random() * 60);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌬️ The Pause Nudge',
        body: 'Take a deep breath. Drop your shoulders. Return to the present moment.',
        sound: 'default',
        data: { type: 'REMINDER_PAUSE' }
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
    console.log(`Scheduled random pause nudge for ${hour}:${minute.toString().padStart(2, '0')}`);
  }

  static async setupAllLocalReminders() {
    // Clear all existing scheduled notifications so we don't duplicate
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    await this.scheduleMorningIntention();
    await this.scheduleEveningReflection();
    await this.scheduleRandomMindfulnessPause();
  }
}
