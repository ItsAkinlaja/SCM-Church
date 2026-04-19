import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

export const useHomeData = () => {
  const [data, setData] = useState({
    latestPamphlet: null,
    upcomingEvents: [],
    announcements: [],
    programmes: [],
    testimonies: [],
    go: null,
    latestSermon: null,
    settings: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchHomeData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const responses = await Promise.all([
          supabase.from('programmes').select('*').order('occurrence', { ascending: false }),
          supabase.from('weekly_materials').select('*').order('week_date', { ascending: false }).limit(1),
          supabase.from('events').select('*').gte('date', new Date().toISOString().split('T')[0]).order('date', { ascending: true }).limit(3),
          supabase.from('announcements').select('*').order('created_at', { ascending: false }).limit(3),
          supabase.from('testimonies').select('*').eq('is_approved', true).order('created_at', { ascending: false }).limit(3),
          supabase.from('leaders').select('*').ilike('role', '%General Overseer%').limit(1).single(),
          supabase.from('sermons').select('*').order('date', { ascending: false }).limit(1),
          supabase.from('settings').select('*').single()
        ]);

        if (isMounted) {
          setData({
            programmes: responses[0].data || [],
            latestPamphlet: responses[1].data?.length ? responses[1].data[0] : null,
            upcomingEvents: responses[2].data || [],
            announcements: responses[3].data || [],
            testimonies: responses[4].data || [],
            go: responses[5].data || null,
            latestSermon: responses[6].data?.length ? responses[6].data[0] : null,
            settings: responses[7].data || null,
          });
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch home data');
          console.error('Error fetching home data:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchHomeData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { ...data, loading, error };
};
