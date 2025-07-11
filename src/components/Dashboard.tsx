import React from "react";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  RefreshCw, 
  Plus, 
  Download,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Copy,
  Share2,
  Shield
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { FinanceCard } from "@/components/FinanceCard";
import { useProfile } from "@/hooks/useProfile";
import { useDeposits } from "@/hooks/useDeposits";
import { useReferrals } from "@/hooks/useReferrals";
import { useReinvestments } from "@/hooks/useReinvestments";
import { useToast } from "@/hooks/use-toast";

export function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, loading: profileLoading } = useProfile();
  const { deposits, loading: depositsLoading } = useDeposits();
  const { referralStats, loading: referralsLoading } = useReferrals();
  const { reinvestments, loading: reinvestmentsLoading, createReinvestment } = useReinvestments();

  // Calculate totals from real data
  const totalDeposited = deposits
    .filter(d => d.status === 'approved')
    .reduce((sum, d) => sum + Number(d.amount), 0);

  const totalReinvested = reinvestments
    .reduce((sum, r) => sum + Number(r.original_amount), 0);

  const totalBalance = totalDeposited + totalReinvested + referralStats.total_earnings;

  // Calculate reinvestment progress
  const activeReinvestments = reinvestments.filter(r => r.status === 'active');
  const reinvestmentProgress = activeReinvestments.length > 0 ? 
    Math.min((Date.now() - new Date(activeReinvestments[0].created_at).getTime()) / 
    (new Date(activeReinvestments[0].maturity_date).getTime() - new Date(activeReinvestments[0].created_at).getTime()) * 100, 100) : 0;

  const stats = [
    {
      title: "Total Balance",
      value: `$${totalBalance.toFixed(2)}`,
      change: totalBalance > 0 ? "+12.5%" : "0%",
      icon: DollarSign,
      trend: "up"
    },
    {
      title: "Total Deposited",
      value: `$${totalDeposited.toFixed(2)}`,
      change: "+8.2%",
      icon: TrendingUp,
      trend: "up"
    },
    {
      title: "Referral Income",
      value: `$${referralStats.total_earnings.toFixed(2)}`,
      change: "+15.3%",
      icon: Users,
      trend: "up"
    },
    {
      title: "Reinvestment Bonus",
      value: `$${reinvestments.reduce((sum, r) => sum + Number(r.bonus_amount), 0).toFixed(2)}`,
      change: "+22.1%",
      icon: RefreshCw,
      trend: "up"
    }
  ];

  // Combine all transactions from different sources
  const allTransactions = [
    ...deposits.map(d => ({
      type: "deposit",
      amount: Number(d.amount),
      date: new Date(d.created_at).toLocaleDateString(),
      status: d.status === 'approved' ? 'completed' : d.status
    })),
    ...reinvestments.map(r => ({
      type: "reinvestment", 
      amount: Number(r.original_amount),
      date: new Date(r.created_at).toLocaleDateString(),
      status: "completed"
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const handleReinvest = async () => {
    if (totalBalance < 100) {
      toast({
        title: "Insufficient Balance",
        description: "You need at least $100 to reinvest.",
        variant: "destructive",
      });
      return;
    }

    const amount = Math.min(totalBalance * 0.5, 1000); // Reinvest up to 50% or $1000
    const result = await createReinvestment(amount);
    
    if (result) {
      toast({
        title: "Reinvestment Successful",
        description: `You've reinvested $${amount.toFixed(2)} with 10% bonus.`,
      });
    }
  };

  const copyReferralCode = () => {
    if (profile?.referral_code) {
      navigator.clipboard.writeText(profile.referral_code);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard.",
      });
    }
  };

  if (profileLoading || depositsLoading || referralsLoading || reinvestmentsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {profile?.display_name || 'User'}!</h1>
          <p className="text-primary-foreground/80">Here's your earnings overview</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <FinanceCard key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-sm text-success flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
            </FinanceCard>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <FinanceCard className="p-6">
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  variant="default" 
                  size="lg" 
                  className="flex-col h-auto py-4"
                  onClick={() => navigate('/deposit')}
                >
                  <Plus className="w-6 h-6 mb-2" />
                  <span>Deposit</span>
                </Button>
                <Button variant="outline" size="lg" className="flex-col h-auto py-4">
                  <Download className="w-6 h-6 mb-2" />
                  <span>Withdraw</span>
                </Button>
                <Button 
                  variant="success" 
                  size="lg" 
                  className="flex-col h-auto py-4"
                  onClick={handleReinvest}
                  disabled={totalBalance < 100}
                >
                  <RefreshCw className="w-6 h-6 mb-2" />
                  <span>Reinvest</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="lg" 
                  className="flex-col h-auto py-4"
                  onClick={copyReferralCode}
                >
                  <Users className="w-6 h-6 mb-2" />
                  <span>Refer</span>
                </Button>
              </div>
            </FinanceCard>

            {/* Growth Progress */}
            <FinanceCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Growth Progress</h3>
                <Badge variant="secondary">Tier 2</Badge>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Reinvestment Progress</span>
                    <span>{reinvestmentProgress.toFixed(1)}% Complete</span>
                  </div>
                  <Progress value={reinvestmentProgress} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Current APY</p>
                    <p className="font-semibold text-success">8.5%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Next Tier APY</p>
                    <p className="font-semibold text-primary">12.0%</p>
                  </div>
                </div>
              </div>
            </FinanceCard>

            {/* Recent Transactions */}
            <FinanceCard className="p-6">
              <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {allTransactions.length > 0 ? allTransactions.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-background rounded-full">
                        {transaction.type === 'deposit' && <Plus className="w-4 h-4 text-success" />}
                        {transaction.type === 'withdrawal' && <Download className="w-4 h-4 text-warning" />}
                        {transaction.type === 'referral' && <Users className="w-4 h-4 text-primary" />}
                        {transaction.type === 'reinvestment' && <RefreshCw className="w-4 h-4 text-success" />}
                      </div>
                      <div>
                        <p className="font-medium capitalize">{transaction.type}</p>
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'withdrawal' ? 'text-destructive' : 'text-success'
                      }`}>
                        {transaction.type === 'withdrawal' ? '-' : '+'}${transaction.amount}
                      </p>
                      <div className="flex items-center gap-1">
                        {transaction.status === 'completed' ? (
                          <CheckCircle className="w-3 h-3 text-success" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 text-warning" />
                        )}
                        <span className="text-xs capitalize">{transaction.status}</span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No transactions yet</p>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => navigate('/deposit')}
                    >
                      Make your first deposit
                    </Button>
                  </div>
                )}
              </div>
            </FinanceCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Referral Card */}
            <FinanceCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Your Referral Code</h3>
              <div className="bg-muted p-4 rounded-lg mb-4 flex items-center justify-between">
                <code className="text-lg font-mono">{profile?.referral_code || 'Loading...'}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyReferralCode}
                  className="ml-2"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div>
                  <p className="text-muted-foreground">Direct Referrals</p>
                  <p className="font-semibold">{referralStats.level_1_count}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Indirect Referrals</p>
                  <p className="font-semibold">{referralStats.level_2_count}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Share your code and earn from referral deposits
              </p>
              <Button variant="outline" className="w-full" onClick={copyReferralCode}>
                <Share2 className="w-4 h-4 mr-2" />
                Share Code
              </Button>
            </FinanceCard>

            {/* Admin Panel Link for Admin Users */}
            {profile?.role === 'admin' && (
              <FinanceCard className="p-6">
                <h3 className="text-lg font-semibold mb-4">Admin Access</h3>
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => navigate('/admin')}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Admin Panel
                </Button>
              </FinanceCard>
            )}

            {/* Tier Benefits */}
            <FinanceCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Tier Benefits</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-sm">8.5% Base APY</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-sm">10% Referral Bonus</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-sm">Priority Support</span>
                </div>
                <div className="flex items-center gap-2 opacity-50">
                  <div className="w-4 h-4 border border-muted-foreground rounded-full" />
                  <span className="text-sm">15% Compound Bonus (Tier 3)</span>
                </div>
              </div>
            </FinanceCard>

            {/* Legal Notice */}
            <FinanceCard className="p-6 bg-warning-light border-warning">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm mb-2">Important Notice</h4>
                  <p className="text-xs text-muted-foreground">
                    Early withdrawal fees apply within 30 days. All earnings are subject to market conditions. 
                    Review our risk disclosure for full details.
                  </p>
                </div>
              </div>
            </FinanceCard>
          </div>
        </div>
      </div>
    </div>
  );
}