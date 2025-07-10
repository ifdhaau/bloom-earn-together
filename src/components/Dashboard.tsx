import { useState } from "react";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  RefreshCw, 
  Plus, 
  Download,
  Calendar,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { FinanceCard } from "@/components/FinanceCard";

export function Dashboard() {
  const [balance, setBalance] = useState(2847.32);
  const [totalEarnings, setTotalEarnings] = useState(847.32);
  const [referralEarnings, setReferralEarnings] = useState(287.50);
  const [reinvestmentBonus, setReinvestmentBonus] = useState(159.82);

  const stats = [
    {
      title: "Total Balance",
      value: `$${balance.toFixed(2)}`,
      change: "+12.5%",
      icon: DollarSign,
      trend: "up"
    },
    {
      title: "Monthly Earnings",
      value: `$${totalEarnings.toFixed(2)}`,
      change: "+8.2%",
      icon: TrendingUp,
      trend: "up"
    },
    {
      title: "Referral Income",
      value: `$${referralEarnings.toFixed(2)}`,
      change: "+15.3%",
      icon: Users,
      trend: "up"
    },
    {
      title: "Reinvestment Bonus",
      value: `$${reinvestmentBonus.toFixed(2)}`,
      change: "+22.1%",
      icon: RefreshCw,
      trend: "up"
    }
  ];

  const recentTransactions = [
    { type: "deposit", amount: 500, date: "2024-01-15", status: "completed" },
    { type: "referral", amount: 75, date: "2024-01-14", status: "completed" },
    { type: "reinvestment", amount: 200, date: "2024-01-13", status: "completed" },
    { type: "withdrawal", amount: 150, date: "2024-01-12", status: "pending" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
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
                <Button variant="default" size="lg" className="flex-col h-auto py-4">
                  <Plus className="w-6 h-6 mb-2" />
                  <span>Deposit</span>
                </Button>
                <Button variant="outline" size="lg" className="flex-col h-auto py-4">
                  <Download className="w-6 h-6 mb-2" />
                  <span>Withdraw</span>
                </Button>
                <Button variant="success" size="lg" className="flex-col h-auto py-4">
                  <RefreshCw className="w-6 h-6 mb-2" />
                  <span>Reinvest</span>
                </Button>
                <Button variant="ghost" size="lg" className="flex-col h-auto py-4">
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
                    <span>Progress to next tier</span>
                    <span>$2,847 / $5,000</span>
                  </div>
                  <Progress value={57} className="h-2" />
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
                {recentTransactions.map((transaction, index) => (
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
                ))}
              </div>
            </FinanceCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Referral Card */}
            <FinanceCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Your Referral Code</h3>
              <div className="bg-muted p-4 rounded-lg mb-4">
                <code className="text-lg font-mono">REF2024GROW</code>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Share your code and earn 10% of your referral's earnings
              </p>
              <Button variant="outline" className="w-full">
                Share Code
              </Button>
            </FinanceCard>

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