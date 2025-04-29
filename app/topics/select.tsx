import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Shuffle, Search, Plus } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { createUserTopic, getPopularTopics } from '@/services/topicService';
import TopicTag from '@/components/TopicTag';
import Colors from '@/constants/Colors';

// Sample predefined topics for random selection
const PREDEFINED_TOPICS = [
  'Technology', 'Health', 'Business', 'Science', 'Politics',
  'Entertainment', 'Sports', 'Climate', 'Education', 'Travel',
  'Food', 'Fashion', 'Design', 'Music', 'Movies', 'Books',
  'Finance', 'Startups', 'Space', 'Artificial Intelligence'
];

export default function SelectTopicScreen() {
  const { session } = useAuth();
  const [customTopic, setCustomTopic] = useState('');
  const [popularTopics, setPopularTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPopular, setIsLoadingPopular] = useState(true);

  const generateRandomTopic = () => {
    const randomIndex = Math.floor(Math.random() * PREDEFINED_TOPICS.length);
    setCustomTopic(PREDEFINED_TOPICS[randomIndex]);
  };

  const handleAddTopic = async () => {
    if (!customTopic.trim()) return;
    
    setIsLoading(true);
    try {
      await createUserTopic(session?.user.id, customTopic.trim());
      router.back();
    } catch (error) {
      console.error('Failed to add topic:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPopularTopic = (topic) => {
    setCustomTopic(topic);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Select Topic</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.inputContainer}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.input}
              value={customTopic}
              onChangeText={setCustomTopic}
              placeholder="Enter a topic (e.g., Technology, Health)"
              placeholderTextColor="#999"
            />
            {customTopic ? (
              <TouchableOpacity onPress={() => setCustomTopic('')} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>✕</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          <TouchableOpacity 
            style={styles.randomButton} 
            onPress={generateRandomTopic}
          >
            <Shuffle size={20} color={Colors.primary} />
            <Text style={styles.randomButtonText}>Random</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.popularContainer}>
          <Text style={styles.sectionTitle}>Popular Topics</Text>
          <View style={styles.topicTagsContainer}>
            {PREDEFINED_TOPICS.slice(0, 12).map((topic, index) => (
              <TopicTag
                key={index}
                label={topic}
                onPress={() => handleSelectPopularTopic(topic)}
                selectable
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.addButton,
            !customTopic.trim() && styles.addButtonDisabled,
            isLoading && styles.addButtonDisabled
          ]}
          onPress={handleAddTopic}
          disabled={!customTopic.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Plus size={20} color="white" />
              <Text style={styles.addButtonText}>Add Topic</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
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
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  clearButton: {
    padding: 6,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#999',
  },
  randomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  randomButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.primary,
    marginLeft: 8,
  },
  popularContainer: {
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
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 16,
    color: '#333',
  },
  topicTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
  },
  addButtonDisabled: {
    backgroundColor: '#aaa',
  },
  addButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: 'white',
    marginLeft: 8,
  },
});