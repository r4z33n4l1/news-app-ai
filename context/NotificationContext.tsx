import React, { createContext, useState, useContext, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { format } from 'date-fns';

type NotificationContextType = {
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
  scheduleNotification: (scheduleData: any) => Promise<string | null>;
  cancelNotification: (identifier: string) => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    // Configure notifications settings
    if (Platform.OS !== 'web') {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });

      // Check for existing permission
      checkPermission();
    }
  }, []);

  const checkPermission = async () => {
    if (Platform.OS === 'web') {
      setHasPermission(false);
      return false;
    }

    const { status } = await Notifications.getPermissionsAsync();
    const isGranted = status === 'granted';
    setHasPermission(isGranted);
    return isGranted;
  };

  const requestPermission = async () => {
    if (Platform.OS === 'web') {
      console.log('Notifications not supported on web platform');
      return false;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    const isGranted = status === 'granted';
    setHasPermission(isGranted);
    return isGranted;
  };

  const scheduleNotification = async (scheduleData: any) => {
    if (Platform.OS === 'web' || !hasPermission) {
      console.log('Cannot schedule notification: Web platform or no permission');
      return null;
    }

    try {
      let trigger;
      let title;
      let body;

      if (scheduleData.type === 'interval') {
        // Convert hours to seconds
        const seconds = scheduleData.interval * 60 * 60;
        trigger = {
          seconds,
          repeats: true,
        };
        title = 'News Brief Update';
        body = `Your ${scheduleData.interval}-hour news brief is ready`;
      } else if (scheduleData.type === 'fixed') {
        const time = new Date(scheduleData.time);
        trigger = {
          hour: time.getHours(),
          minute: time.getMinutes(),
          repeats: true,
        };
        title = 'Scheduled News Brief';
        body = `Your ${format(time, 'h:mm a')} news brief is ready`;
      } else {
        throw new Error('Invalid notification type');
      }

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: { topic: 'Your selected topic' },
        },
        trigger,
      });

      return identifier;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  };

  const cancelNotification = async (identifier: string) => {
    if (Platform.OS !== 'web') {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    }
  };

  const value = {
    hasPermission,
    requestPermission,
    scheduleNotification,
    cancelNotification,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};