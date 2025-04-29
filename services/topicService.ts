import { supabase } from './supabase';

// Fetch a user's topics
export const fetchUserTopics = async (userId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('user_topics')
      .select('topic')
      .eq('user_id', userId);

    if (error) throw error;
    return data.map(item => item.topic);
  } catch (error) {
    console.error('Error fetching user topics:', error);
    return [];
  }
};

// Create a new topic for user
export const createUserTopic = async (userId: string, topic: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('user_topics')
      .insert([
        { user_id: userId, topic }
      ]);

    if (error) throw error;
  } catch (error) {
    console.error('Error creating user topic:', error);
    throw error;
  }
};

// Delete a user's topic
export const deleteUserTopic = async (userId: string, topic: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('user_topics')
      .delete()
      .eq('user_id', userId)
      .eq('topic', topic);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting user topic:', error);
    throw error;
  }
};

// Get popular topics (could be based on most selected topics by users)
export const getPopularTopics = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('user_topics')
      .select('topic, count')
      .order('count', { ascending: false })
      .limit(10);

    if (error) throw error;
    return data.map(item => item.topic);
  } catch (error) {
    console.error('Error fetching popular topics:', error);
    return [];
  }
};

// For simplicity in this demo, this would be replaced with actual API call
export const fetchNewsSummary = async (topic: string): Promise<any> => {
  // This would call a Supabase Edge Function that interfaces with Perplexity
  try {
    return {
      title: `Latest on ${topic}`,
      summary: `This is a simulated news summary about ${topic}...`,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching news summary:', error);
    throw error;
  }
};