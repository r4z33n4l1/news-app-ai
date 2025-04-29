import { createClient } from 'npm:@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get all active notification schedules
    const { data: schedules, error: schedulesError } = await supabase
      .from('notification_schedules')
      .select(`
        id,
        user_id,
        type,
        interval,
        time,
        days,
        user_topics (topic)
      `)
      .eq('notification_settings.enabled', true)
      .inner('notification_settings', { user_id: 'notification_schedules.user_id' });

    if (schedulesError) {
      throw schedulesError;
    }

    const now = new Date();
    const processedSchedules = [];

    for (const schedule of schedules) {
      try {
        if (schedule.type === 'interval') {
          // Process interval-based notifications
          const { data: lastSummary } = await supabase
            .from('news_summaries')
            .select('created_at')
            .eq('user_id', schedule.user_id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          const hoursSinceLastSummary = lastSummary
            ? (now.getTime() - new Date(lastSummary.created_at).getTime()) / (1000 * 60 * 60)
            : schedule.interval + 1;

          if (hoursSinceLastSummary >= schedule.interval) {
            processedSchedules.push(schedule);
          }
        } else if (schedule.type === 'fixed') {
          // Process fixed-time notifications
          const scheduleTime = new Date(`1970-01-01T${schedule.time}Z`);
          const currentTime = new Date(`1970-01-01T${now.getHours()}:${now.getMinutes()}:00Z`);

          if (
            schedule.days.includes(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()]) &&
            Math.abs(scheduleTime.getTime() - currentTime.getTime()) <= 5 * 60 * 1000 // Within 5 minutes
          ) {
            processedSchedules.push(schedule);
          }
        }
      } catch (error) {
        console.error(`Error processing schedule ${schedule.id}:`, error);
      }
    }

    return new Response(
      JSON.stringify({
        processed: processedSchedules.length,
        schedules: processedSchedules,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});