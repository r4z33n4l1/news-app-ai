import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Newspaper, RefreshCcw } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { fetchUserTopics } from '@/services/topicService';
import NewsCard from '@/components/NewsCard';
import EmptyState from '@/components/EmptyState';
import TopicTag from '@/components/TopicTag';
import Colors from '@/constants/Colors';

export default function HomeScreen() {
  const { session } = useAuth();
  const [userTopics, setUserTopics] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (session) {
      loadTopics();
    }
  }, [session]);

  const loadTopics = async () => {
    try {
      setIsLoading(true);
      const topics = await fetchUserTopics(session?.user.id);
      setUserTopics(topics);
    } catch (error) {
      console.error('Failed to load topics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTopics();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>News Briefs</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <RefreshCcw size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {!isLoading && userTopics.length === 0 ? (
          <EmptyState
            title="No Topics Added Yet"
            description="Add your first topic to get started with news briefs"
            icon={<Newspaper size={48} color={Colors.primary} />}
            actionLabel="Add a Topic"
            onPress={() => router.push('/topics/select')}
          />
        ) : (
          <View style={styles.mainContent}>
            <View style={styles.topicsContainer}>
              <Text style={styles.sectionTitle}>Your Topics</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.topicsList}
              >
                {userTopics.map((topic, index) => (
                  <TopicTag key={index} label={topic} />
                ))}
                <TouchableOpacity
                  style={styles.addTopicButton}
                  onPress={() => router.push('/topics/select')}
                >
                  <Text style={styles.addTopicText}>+ Add Topic</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            <View style={styles.newsSection}>
              <Text style={styles.sectionTitle}>Latest Summaries</Text>
              {/* This would be populated with actual news data from the backend */}
              <NewsCard
                title="AI Advancements"
                summary="Recent breakthroughs in artificial intelligence are transforming how businesses approach automation and data analysis."
                timestamp="2 hours ago"
                topic="Technology"
              />
              <NewsCard
                title="Climate Policy Updates"
                summary="Several countries announced new commitments to reduce carbon emissions ahead of the upcoming climate summit."
                timestamp="5 hours ago"
                topic="Environment"
              />
            </View>
          </View>
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  refreshButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  mainContent: {
    padding: 16,
  },
  topicsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 12,
    color: '#333',
  },
  topicsList: {
    flexDirection: 'row',
    paddingBottom: 8,
  },
  addTopicButton: {
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ddd',
  },
  addTopicText: {
    fontFamily: 'Inter-Medium',
    color: Colors.primary,
  },
  newsSection: {
    marginBottom: 16,
  },
});