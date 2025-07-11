import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  id: string;
  user_id: string;
  display_name: string | null;
  role: string | null;
  created_at: string;
}

interface AdminDeposit {
  id: string;
  user_id: string;
  amount: number;
  status: string | null;
  payment_method: string | null;
  created_at: string;
}

interface AdminStats {
  total_users: number;
  total_deposits: number;
  pending_deposits: number;
  platform_earnings: number;
}

export function useAdminData() {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [deposits, setDeposits] = useState<AdminDeposit[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    total_users: 0,
    total_deposits: 0,
    pending_deposits: 0,
    platform_earnings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchAdminData();
  }, [user]);

  const fetchAdminData = async () => {
    try {
      // Check if user is admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user?.id)
        .single();

      if (profile?.role !== 'admin') {
        setLoading(false);
        return;
      }

      // Fetch all users with their stats
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select(`
          id,
          user_id,
          display_name,
          role,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (usersError) {
        console.error('Error fetching users:', usersError);
      }

      // Fetch all deposits
      const { data: depositsData, error: depositsError } = await supabase
        .from('deposits')
        .select('*')
        .order('created_at', { ascending: false });

      if (depositsError) {
        console.error('Error fetching deposits:', depositsError);
      }

      // Calculate stats
      const totalDeposits = (depositsData || [])
        .filter(d => d.status === 'approved')
        .reduce((sum, d) => sum + Number(d.amount), 0);

      const pendingDeposits = (depositsData || [])
        .filter(d => d.status === 'pending').length;

      const platformEarnings = totalDeposits * 0.02; // Assume 2% platform fee

      setUsers(usersData || []);
      setDeposits(depositsData || []);
      setStats({
        total_users: usersData?.length || 0,
        total_deposits: totalDeposits,
        pending_deposits: pendingDeposits,
        platform_earnings: platformEarnings
      });

    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateDepositStatus = async (depositId: string, status: string) => {
    const { error } = await supabase
      .from('deposits')
      .update({ status })
      .eq('id', depositId);

    if (error) {
      console.error('Error updating deposit status:', error);
      return false;
    }

    await fetchAdminData(); // Refresh data
    return true;
  };

  const updatePlatformSetting = async (key: string, value: string) => {
    const { error } = await supabase
      .from('platform_settings')
      .upsert({ 
        setting_key: key, 
        setting_value: value 
      });

    if (error) {
      console.error('Error updating platform setting:', error);
      return false;
    }

    return true;
  };

  return { 
    users, 
    deposits, 
    stats, 
    loading, 
    updateDepositStatus, 
    updatePlatformSetting,
    refreshData: fetchAdminData
  };
}