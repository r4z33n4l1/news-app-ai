import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { format, formatDistanceToNow } from 'date-fns';
import Colors from '@/constants/Colors';

type TimeDisplayProps = {
  label: string;
  timestamp: number | string | Date;
  showExactTime?: boolean;
};

const TimeDisplay: React.FC<TimeDisplayProps> = ({
  label,
  timestamp,
  showExactTime = false,
}) => {
  const formatTime = () => {
    try {
      const date = new Date(timestamp);
      
      if (showExactTime) {
        return format(date, 'MMM d, yyyy h:mm a');
      } else {
        return formatDistanceToNow(date, { addSuffix: true });
      }
    } catch (error) {
      return 'Invalid time';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.time}>{formatTime()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  time: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
  },
});

export default TimeDisplay;