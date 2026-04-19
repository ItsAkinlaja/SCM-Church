import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

export const useAdminStats = () => {
  const [stats, setStats] = useState({
    members: 0,
    events: 0,
    pamphlets: 0,
    announcements: 0,
    leaders: 0,
    programmes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const [members, events, pamphlets, announcements, leaders, programmes] = await Promise.all([
          supabase.from('members').select('*', { count: 'exact', head: true }),
          supabase.from('events').select('*', { count: 'exact', head: true }),
          supabase.from('weekly_materials').select('*', { count: 'exact', head: true }),
          supabase.from('announcements').select('*', { count: 'exact', head: true }),
          supabase.from('leaders').select('*', { count: 'exact', head: true }),
          supabase.from('programmes').select('*', { count: 'exact', head: true }),
        ]);

        if (isMounted) {
          setStats({
            members: members.count || 0,
            events: events.count || 0,
            pamphlets: pamphlets.count || 0,
            announcements: announcements.count || 0,
            leaders: leaders.count || 0,
            programmes: programmes.count || 0,
          });
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch stats');
          console.error('Error fetching admin stats:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return { stats, loading, error };
};
