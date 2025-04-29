import { supabase } from './supabase';

// Get notification settings for a user
export const getNotificationSettings = async (userId: string) => {
  try {
    // Get main settings
    const { data: settings, error: settingsError } = await supabase
      .from('notification_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle(); // Use maybeSingle() instead of single() to handle no results gracefully

    if (settingsError && settingsError.code !== 'PGRST116') {
      throw settingsError;
    }

    // Get schedules
    const { data: schedules, error: schedulesError } = await supabase
      .from('notification_schedules')
      .select('*')
      .eq('user_id', userId);

    if (schedulesError) throw schedulesError;

    return {
      enabled: settings?.enabled ?? false, // Use nullish coalescing for better default handling
      schedules: schedules || []
    };
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    return { enabled: false, schedules: [] };
  }
};

// Update notification settings
export const updateNotificationSettings = async (userId: string, settings: { enabled: boolean }) => {
  try {
    // Check if settings exist
    const { data: existing, error: checkError } = await supabase
      .from('notification_settings')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existing) {
      // Update existing settings
      const { error } = await supabase
        .from('notification_settings')
        .update({ enabled: settings.enabled })
        .eq('user_id', userId);

      if (error) throw error;
    } else {
      // Create new settings
      const { error } = await supabase
        .from('notification_settings')
        .insert([{ user_id: userId, enabled: settings.enabled }]);

      if (error) throw error;
    }
  } catch (error) {
    console.error('Error updating notification settings:', error);
    throw error;
  }
};

// Create a new notification schedule
export const createNotificationSchedule = async (scheduleData: any) => {
  try {
    const { error } = await supabase
      .from('notification_schedules')
      .insert([scheduleData]);

    if (error) throw error;
  } catch (error) {
    console.error('Error creating notification schedule:', error);
    throw error;
  }
};

// Delete a notification schedule
export const deleteNotificationSchedule = async (scheduleId: string) => {
  try {
    const { error } = await supabase
      .from('notification_schedules')
      .delete()
      .eq('id', scheduleId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting notification schedule:', error);
    throw error;
  }
};