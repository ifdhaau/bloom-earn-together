import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Deposit {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  payment_method: string;
  created_at: string;
}

export function useDeposits() {
  const { user } = useAuth();
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setDeposits([]);
      setLoading(false);
      return;
    }

    const fetchDeposits = async () => {
      const { data, error } = await supabase
        .from('deposits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching deposits:', error);
      } else {
        setDeposits(data || []);
      }
      setLoading(false);
    };

    fetchDeposits();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('deposits_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'deposits',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchDeposits();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { deposits, loading };
}