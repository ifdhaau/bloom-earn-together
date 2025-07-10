import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface ReferralEarning {
  id: string;
  user_id: string;
  amount: number;
  level: number;
  percentage: number;
  created_at: string;
  from_user_id: string;
}

interface ReferralStats {
  total_earnings: number;
  level_1_earnings: number;
  level_2_earnings: number;
  level_1_count: number;
  level_2_count: number;
}

export function useReferrals() {
  const { user } = useAuth();
  const [referralEarnings, setReferralEarnings] = useState<ReferralEarning[]>([]);
  const [referralStats, setReferralStats] = useState<ReferralStats>({
    total_earnings: 0,
    level_1_earnings: 0,
    level_2_earnings: 0,
    level_1_count: 0,
    level_2_count: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setReferralEarnings([]);
      setReferralStats({
        total_earnings: 0,
        level_1_earnings: 0,
        level_2_earnings: 0,
        level_1_count: 0,
        level_2_count: 0
      });
      setLoading(false);
      return;
    }

    const fetchReferralData = async () => {
      // Fetch referral earnings with user details
      const { data: earnings, error: earningsError } = await supabase
        .from('referral_earnings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (earningsError) {
        console.error('Error fetching referral earnings:', earningsError);
      } else {
        setReferralEarnings(earnings || []);
      }

      // Calculate stats from earnings data
      const level1Earnings = (earnings || [])
        .filter(e => e.level === 1)
        .reduce((sum, e) => sum + Number(e.amount), 0);
      const level2Earnings = (earnings || [])
        .filter(e => e.level === 2)
        .reduce((sum, e) => sum + Number(e.amount), 0);

      setReferralStats({
        total_earnings: level1Earnings + level2Earnings,
        level_1_earnings: level1Earnings,
        level_2_earnings: level2Earnings,
        level_1_count: new Set((earnings || []).filter(e => e.level === 1).map(e => e.from_user_id)).size,
        level_2_count: new Set((earnings || []).filter(e => e.level === 2).map(e => e.from_user_id)).size
      });

      setLoading(false);
    };

    fetchReferralData();
  }, [user]);

  return { referralEarnings, referralStats, loading };
}