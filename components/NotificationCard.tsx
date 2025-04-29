import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Clock, CreditCard as Edit2 } from 'lucide-react-native';
import { format } from 'date-fns';
import Colors from '@/constants/Colors';

type NotificationCardProps = {
  type: 'interval' | 'fixed';
  time?: string;
  interval?: number;
  days?: string[];
  onEdit?: () => void;
};

const NotificationCard: React.FC<NotificationCardProps> = ({
  type,
  time,
  interval,
  days,
  onEdit
}) => {
  const formatScheduleInfo = () => {
    if (type === 'interval' && interval) {
      return `Every ${interval} hour${interval > 1 ? 's' : ''}`;
    } else if (type === 'fixed' && time) {
      const timeObj = new Date(time);
      const formattedTime = format(timeObj, 'h:mm a');
      
      if (days && days.length > 0) {
        if (days.length === 7) {
          return `Daily at ${formattedTime}`;
        } else {
          const dayStr = days.join(', ');
          return `${formattedTime} on ${dayStr}`;
        }
      } else {
        return `At ${formattedTime}`;
      }
    }
    
    return 'Schedule details unavailable';
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <Clock size={20} color={Colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {type === 'interval' ? 'Interval Notification' : 'Fixed Time Notification'}
          </Text>
          <Text style={styles.scheduleText}>{formatScheduleInfo()}</Text>
        </View>
        
        {onEdit && (
          <TouchableOpacity style={styles.editButton} onPress={onEdit}>
            <Edit2 size={18} color="#999" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
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
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    padding: 12,
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  scheduleText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    padding: 8,
  },
});

export default NotificationCard;