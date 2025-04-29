import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Switch, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Clock, Calendar, Save } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { createNotificationSchedule } from '@/services/notificationService';
import TimePickerModal from '@/components/TimePickerModal';
import Colors from '@/constants/Colors';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function ScheduleNotificationScreen() {
  const { session } = useAuth();
  const { id } = useLocalSearchParams();
  const { scheduleNotification } = useNotifications();
  
  // Default to interval mode
  const [scheduleType, setScheduleType] = useState('interval'); // 'interval' or 'fixed'
  
  // Interval mode settings
  const [intervalHours, setIntervalHours] = useState('6');
  
  // Fixed time mode settings
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [selectedDays, setSelectedDays] = useState(
    WEEKDAYS.reduce((acc, day) => ({ ...acc, [day]: false }), {})
  );

  const handleSave = async () => {
    try {
      let scheduleData;
      
      if (scheduleType === 'interval') {
        // Validate interval
        const hours = parseInt(intervalHours, 10);
        if (isNaN(hours) || hours < 1 || hours > 24) {
          alert('Please enter a valid interval between 1 and 24 hours');
          return;
        }
        
        scheduleData = {
          type: 'interval',
          interval: hours,
          userId: session?.user.id
        };
      } else {
        // Validate fixed time
        const selectedDaysList = Object.entries(selectedDays)
          .filter(([_, selected]) => selected)
          .map(([day]) => day);
          
        if (selectedDaysList.length === 0) {
          alert('Please select at least one day of the week');
          return;
        }
        
        scheduleData = {
          type: 'fixed',
          time: selectedTime.toISOString(),
          days: selectedDaysList,
          userId: session?.user.id
        };
      }
      
      // Save the schedule data
      await createNotificationSchedule(scheduleData);
      
      // Schedule the notification
      await scheduleNotification(scheduleData);
      
      // Navigate back
      router.back();
    } catch (error) {
      console.error('Failed to save notification schedule:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const toggleDay = (day) => {
    setSelectedDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Schedule Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.scheduleTypeCard}>
          <Text style={styles.cardTitle}>Notification Type</Text>
          
          <View style={styles.scheduleTypeOptions}>
            <TouchableOpacity
              style={[
                styles.scheduleTypeOption,
                scheduleType === 'interval' && styles.scheduleTypeOptionActive
              ]}
              onPress={() => setScheduleType('interval')}
            >
              <Clock size={20} color={scheduleType === 'interval' ? Colors.primary : '#666'} />
              <Text style={[
                styles.scheduleTypeText,
                scheduleType === 'interval' && styles.scheduleTypeTextActive
              ]}>Interval</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.scheduleTypeOption,
                scheduleType === 'fixed' && styles.scheduleTypeOptionActive
              ]}
              onPress={() => setScheduleType('fixed')}
            >
              <Calendar size={20} color={scheduleType === 'fixed' ? Colors.primary : '#666'} />
              <Text style={[
                styles.scheduleTypeText,
                scheduleType === 'fixed' && styles.scheduleTypeTextActive
              ]}>Fixed Time</Text>
            </TouchableOpacity>
          </View>
        </View>

        {scheduleType === 'interval' ? (
          <View style={styles.settingsCard}>
            <Text style={styles.cardTitle}>Interval Settings</Text>
            <Text style={styles.settingDescription}>
              Receive notifications at regular intervals throughout the day
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Every</Text>
              <TextInput
                style={styles.intervalInput}
                value={intervalHours}
                onChangeText={setIntervalHours}
                keyboardType="number-pad"
                maxLength={2}
              />
              <Text style={styles.inputLabel}>hours</Text>
            </View>
            
            <Text style={styles.helperText}>
              Enter a value between 1 and 24 hours
            </Text>
          </View>
        ) : (
          <View style={styles.settingsCard}>
            <Text style={styles.cardTitle}>Fixed Time Settings</Text>
            <Text style={styles.settingDescription}>
              Receive notifications at specific times on selected days
            </Text>
            
            <TouchableOpacity
              style={styles.timeSelector}
              onPress={() => setTimePickerVisible(true)}
            >
              <Clock size={20} color={Colors.primary} />
              <Text style={styles.timeText}>{formatTime(selectedTime)}</Text>
            </TouchableOpacity>
            
            <View style={styles.daysContainer}>
              <Text style={styles.daysTitle}>Repeat on</Text>
              
              {WEEKDAYS.map((day) => (
                <View key={day} style={styles.dayRow}>
                  <Text style={styles.dayText}>{day}</Text>
                  <Switch
                    value={selectedDays[day]}
                    onValueChange={() => toggleDay(day)}
                    trackColor={{ false: '#ddd', true: Colors.primaryLight }}
                    thumbColor={selectedDays[day] ? Colors.primary : '#f4f3f4'}
                  />
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Save size={20} color="white" />
          <Text style={styles.saveButtonText}>Save Schedule</Text>
        </TouchableOpacity>
      </View>

      {Platform.OS !== 'web' && (
        <TimePickerModal
          visible={timePickerVisible}
          selectedTime={selectedTime}
          onTimeSelected={(time) => {
            setSelectedTime(time);
            setTimePickerVisible(false);
          }}
          onCancel={() => setTimePickerVisible(false)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  scheduleTypeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 16,
    color: '#333',
  },
  scheduleTypeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scheduleTypeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 4,
  },
  scheduleTypeOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  scheduleTypeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginLeft: 8,
    color: '#666',
  },
  scheduleTypeTextActive: {
    color: Colors.primary,
  },
  settingsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#333',
  },
  intervalInput: {
    height: 50,
    width: 60,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  helperText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#999',
  },
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 24,
  },
  timeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    marginLeft: 12,
    color: '#333',
  },
  daysContainer: {
    marginBottom: 16,
  },
  daysTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 12,
    color: '#333',
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dayText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
  },
  saveButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: 'white',
    marginLeft: 8,
  },
});