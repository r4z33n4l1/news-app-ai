import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Clock } from 'lucide-react-native';
import Colors from '@/constants/Colors';

type NewsCardProps = {
  title: string;
  summary: string;
  timestamp: string;
  topic: string;
  onPress?: () => void;
};

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  summary,
  timestamp,
  topic,
  onPress
}) => {
  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <Text style={styles.topicText}>{topic}</Text>
        <View style={styles.timeContainer}>
          <Clock size={14} color="#999" />
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View>
      </View>
      
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.summary} numberOfLines={3}>{summary}</Text>
      
      <TouchableOpacity style={styles.readMoreContainer}>
        <Text style={styles.readMoreText}>Read more</Text>
      </TouchableOpacity>
    </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  topicText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: Colors.primary,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#333',
    marginBottom: 8,
  },
  summary: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  readMoreContainer: {
    alignSelf: 'flex-start',
  },
  readMoreText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary,
  },
});

export default NewsCard;