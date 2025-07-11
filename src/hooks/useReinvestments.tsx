import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Reinvestment {
  id: string;
  user_id: string;
  original_amount: number;
  bonus_amount: number;
  bonus_percentage: number;
  maturity_date: string;
  status: string;
  created_at: string;
}

export function useReinvestments() {
  const { user } = useAuth();
  const [reinvestments, setReinvestments] = useState<Reinvestment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setReinvestments([]);
      setLoading(false);
      return;
    }

    const fetchReinvestments = async () => {
      const { data, error } = await supabase
        .from('reinvestments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reinvestments:', error);
      } else {
        setReinvestments(data || []);
      }
      setLoading(false);
    };

    fetchReinvestments();
  }, [user]);

  const createReinvestment = async (amount: number) => {
    if (!user) return null;
    
    const maturityDate = new Date();
    maturityDate.setDate(maturityDate.getDate() + 365); // 1 year from now

    const { data, error } = await supabase
      .from('reinvestments')
      .insert({
        user_id: user.id,
        original_amount: amount,
        bonus_amount: amount * 0.1, // 10% bonus
        bonus_percentage: 10,
        maturity_date: maturityDate.toISOString(),
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating reinvestment:', error);
      return null;
    }

    return data;
  };

  return { reinvestments, loading, createReinvestment };
}