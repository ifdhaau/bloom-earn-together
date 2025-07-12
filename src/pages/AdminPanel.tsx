import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, DollarSign, TrendingUp, Shield } from 'lucide-react';

interface UserStats {
  email: string;
  total_earnings: number;
  total_reinvestments: number;
  reinvestment_count: number;
}

export function AdminPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPlatformEarnings: 0,
    totalReinvestments: 0
  });

  useEffect(() => {
    // Check if user is admin
    if (user?.email !== 'jareebe641@gmail.com') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page",
        variant: "destructive"
      });
      navigate('/dashboard');
      return;
    }

    fetchAdminData();
  }, [user, navigate, toast]);

  const fetchAdminData = async () => {
    try {
      // Fetch all users from auth (we'll need to use RPC or a different approach)
      // For now, let's fetch from earnings and reinvestments tables
      
      // Get all earnings
      const { data: earningsData, error: earningsError } = await supabase
        .from('Earnings')
        .select('user_id, total');

      // Get all reinvestments
      const { data: reinvestmentsData, error: reinvestmentsError } = await supabase
        .from('Reinvestments')
        .select('user_id, amount');

      if (earningsError) throw earningsError;
      if (reinvestmentsError) throw reinvestmentsError;

      // Process user stats
      const userMap = new Map<string, UserStats>();
      
      // Add earnings data
      earningsData?.forEach(earning => {
        if (!userMap.has(earning.user_id)) {
          userMap.set(earning.user_id, {
            email: earning.user_id, // We'll show user ID for now since we can't easily get email
            total_earnings: 0,
            total_reinvestments: 0,
            reinvestment_count: 0
          });
        }
        const user = userMap.get(earning.user_id)!;
        user.total_earnings = earning.total || 0;
      });

      // Add reinvestments data
      reinvestmentsData?.forEach(reinvestment => {
        if (!userMap.has(reinvestment.user_id)) {
          userMap.set(reinvestment.user_id, {
            email: reinvestment.user_id,
            total_earnings: 0,
            total_reinvestments: 0,
            reinvestment_count: 0
          });
        }
        const user = userMap.get(reinvestment.user_id)!;
        user.total_reinvestments += reinvestment.amount || 0;
        user.reinvestment_count += 1;
      });

      const userStats = Array.from(userMap.values());
      setUsers(userStats);

      // Calculate platform stats
      const totalUsers = userStats.length;
      const totalPlatformEarnings = userStats.reduce((sum, user) => sum + user.total_earnings, 0);
      const totalReinvestments = userStats.reduce((sum, user) => sum + user.total_reinvestments, 0);

      setStats({
        totalUsers,
        totalPlatformEarnings,
        totalReinvestments
      });

    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch admin data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button 
              onClick={() => navigate('/dashboard')}
              variant="ghost"
              className="text-white hover:bg-white/10 mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <Shield className="w-8 h-8 mr-3" />
                Admin Panel
              </h1>
              <p className="text-gray-300">Platform overview and user management</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats.totalUsers}
              </div>
              <p className="text-xs text-gray-400">
                Active platform users
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Platform Earnings
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ${stats.totalPlatformEarnings.toFixed(2)}
              </div>
              <p className="text-xs text-gray-400">
                Total user earnings
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Total Reinvested
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ${stats.totalReinvestments.toFixed(2)}
              </div>
              <p className="text-xs text-gray-400">
                Total reinvestments
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white">User Overview</CardTitle>
            <CardDescription className="text-gray-300">
              Detailed view of all platform users and their activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/20">
                      <TableHead className="text-gray-300">User ID</TableHead>
                      <TableHead className="text-gray-300">Current Earnings</TableHead>
                      <TableHead className="text-gray-300">Total Reinvested</TableHead>
                      <TableHead className="text-gray-300">Reinvestments</TableHead>
                      <TableHead className="text-gray-300">Portfolio Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user, index) => (
                      <TableRow key={user.email} className="border-white/10">
                        <TableCell className="text-white font-medium">
                          User #{index + 1}
                        </TableCell>
                        <TableCell className="text-green-400">
                          ${user.total_earnings.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-blue-400">
                          ${user.total_reinvestments.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-purple-400">
                          {user.reinvestment_count}
                        </TableCell>
                        <TableCell className="text-white font-semibold">
                          ${(user.total_earnings + user.total_reinvestments).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Platform Actions */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 mt-6">
          <CardHeader>
            <CardTitle className="text-white">Platform Actions</CardTitle>
            <CardDescription className="text-gray-300">
              Administrative tools and platform management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={fetchAdminData}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Refresh Data
              </Button>
              <Button 
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                disabled
              >
                Export Reports (Coming Soon)
              </Button>
              <Button 
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                disabled
              >
                Platform Settings (Coming Soon)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}