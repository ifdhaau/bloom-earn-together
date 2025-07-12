import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { DollarSign, TrendingUp, Users, LogOut, Plus, RefreshCw, Minus } from 'lucide-react';

interface UserData {
  total_earnings: number;
  total_reinvestments: number;
  reinvestment_count: number;
}

export function Dashboard() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData>({
    total_earnings: 0,
    total_reinvestments: 0,
    reinvestment_count: 0
  });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserData();
      checkAdminStatus();
    }
  }, [user]);

  const checkAdminStatus = () => {
    if (user?.email === 'jareebe641@gmail.com') {
      setIsAdmin(true);
    }
  };

  const fetchUserData = async () => {
    try {
      // Fetch earnings
      const { data: earningsData, error: earningsError } = await supabase
        .from('Earnings')
        .select('total')
        .eq('user_id', user?.id)
        .single();

      // Fetch reinvestments
      const { data: reinvestmentsData, error: reinvestmentsError } = await supabase
        .from('Reinvestments')
        .select('amount')
        .eq('user_id', user?.id);

      if (earningsError && earningsError.code !== 'PGRST116') {
        console.error('Error fetching earnings:', earningsError);
      }

      if (reinvestmentsError) {
        console.error('Error fetching reinvestments:', reinvestmentsError);
      }

      const totalEarnings = earningsData?.total || 0;
      const totalReinvestments = reinvestmentsData?.reduce((sum, r) => sum + (r.amount || 0), 0) || 0;
      const reinvestmentCount = reinvestmentsData?.length || 0;

      setUserData({
        total_earnings: totalEarnings,
        total_reinvestments: totalReinvestments,
        reinvestment_count: reinvestmentCount
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-300">Welcome back, {user?.email}</p>
          </div>
          <div className="flex gap-4">
            {isAdmin && (
              <Button 
                onClick={() => navigate('/admin')}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Admin Panel
              </Button>
            )}
            <Button 
              onClick={handleSignOut}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Current Earnings
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ${userData.total_earnings.toFixed(2)}
              </div>
              <p className="text-xs text-gray-400">
                Available for reinvestment
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Total Reinvested
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ${userData.total_reinvestments.toFixed(2)}
              </div>
              <p className="text-xs text-gray-400">
                {userData.reinvestment_count} transactions
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Total Portfolio
              </CardTitle>
              <Users className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ${(userData.total_earnings + userData.total_reinvestments).toFixed(2)}
              </div>
              <p className="text-xs text-gray-400">
                Lifetime value
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Button 
            onClick={() => navigate('/recharge')}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-6"
          >
            <Plus className="w-5 h-5 mr-2" />
            Recharge
          </Button>

          <Button 
            onClick={() => navigate('/reinvest')}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-6"
            disabled={userData.total_earnings <= 0}
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Reinvest
          </Button>

          <Button 
            onClick={() => navigate('/withdraw')}
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-6"
          >
            <Minus className="w-5 h-5 mr-2" />
            Withdraw
          </Button>

          <Button 
            onClick={fetchUserData}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 font-bold py-6"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
            <CardDescription className="text-gray-300">
              Your latest transactions and earnings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-gray-400">No recent activity to show</p>
              <p className="text-sm text-gray-500 mt-2">Start by making a recharge or reinvestment</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}