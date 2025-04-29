import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Bell, Clock, CircleAlert as AlertCircle, CirclePlus as PlusCircle } from 'lucide-react-native';
import { useNotifications } from '@/context/NotificationContext';
import { getNotificationSettings, updateNotificationSettings } from '@/services/notificationService';
import { useAuth } from '@/context/AuthContext';
import NotificationCard from '@/components/NotificationCard';
import EmptyState from '@/components/EmptyState';
import TimeDisplay from '@/components/TimeDisplay';
import Colors from '@/constants/Colors';

export default function NotificationsScreen() {
  const { session } = useAuth();
  const { hasPermission, requestPermission } = useNotifications();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationSchedules, setNotificationSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session) {
      loadNotificationSettings();
    }
  }, [session]);

  const loadNotificationSettings = async () => {
    try {
      setIsLoading(true);
      const settings = await getNotificationSettings(session?.user.id);
      setNotificationsEnabled(settings.enabled);
      setNotificationSchedules(settings.schedules || []);
    } catch (error) {
      console.error('Failed to load notification settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleNotifications = async (value) => {
    if (value && !hasPermission) {
      const granted = await requestPermission();
      if (!granted) {
        return;
      }
    }

    try {
      setNotificationsEnabled(value);
      await updateNotificationSettings(session?.user.id, { enabled: value });
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      setNotificationsEnabled(!value); // Revert on error
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Bell size={20} color={Colors.primary} />
              <Text style={styles.settingTitle}>Enable Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#ddd', true: Colors.primaryLight }}
              thumbColor={notificationsEnabled ? Colors.primary : '#f4f3f4'}
            />
          </View>
          
          {!hasPermission && notificationsEnabled && (
            <View style={styles.permissionWarning}>
              <AlertCircle size={16} color={Colors.warning} />
              <Text style={styles.permissionText}>
                Notification permissions required. Tap to grant.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.scheduleSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Notification Schedule</Text>
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={() => router.push('/notifications/schedule')}
              disabled={!notificationsEnabled}
            >
              <PlusCircle size={20} color={notificationsEnabled ? Colors.primary : Colors.inactive} />
            </TouchableOpacity>
          </View>

          {notificationsEnabled && notificationSchedules.length === 0 ? (
            <EmptyState
              title="No Schedules Set"
              description="Set up when you'd like to receive news updates"
              icon={<Clock size={48} color={Colors.primary} />}
              actionLabel="Add Schedule"
              onPress={() => router.push('/notifications/schedule')}
            />
          ) : (
            notificationSchedules.map((schedule, index) => (
              <NotificationCard
                key={index}
                type={schedule.type}
                time={schedule.time}
                interval={schedule.interval}
                days={schedule.days}
                onEdit={() => router.push({
                  pathname: '/notifications/schedule',
                  params: { id: schedule.id }
                })}
              />
            ))
          )}
        </View>

        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Recent Notifications</Text>
          <TimeDisplay 
            label="Last notification received"
            timestamp={Date.now() - 3600000} // Placeholder: 1 hour ago
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: Colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  settingsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  permissionWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9C4',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  permissionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.warning,
    marginLeft: 8,
  },
  scheduleSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#333',
  },
  addButton: {
    padding: 4,
  },
  historySection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
});