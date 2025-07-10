import { useState } from "react";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  Bell,
  FileText,
  Settings,
  BarChart3,
  Shield,
  Eye
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinanceCard } from "@/components/FinanceCard";

export function AdminPanel() {
  const [activeUsers, setActiveUsers] = useState(1247);
  const [totalDeposits, setTotalDeposits] = useState(342750);
  const [platformGrowth, setPlatformGrowth] = useState(23.5);

  const adminStats = [
    {
      title: "Active Users",
      value: activeUsers.toLocaleString(),
      change: "+12.3%",
      icon: Users,
      trend: "up"
    },
    {
      title: "Total Deposits",
      value: `$${totalDeposits.toLocaleString()}`,
      change: "+18.7%", 
      icon: DollarSign,
      trend: "up"
    },
    {
      title: "Platform Growth",
      value: `${platformGrowth}%`,
      change: "+5.2%",
      icon: TrendingUp,
      trend: "up"
    },
    {
      title: "Pending Reviews",
      value: "8",
      change: "-2",
      icon: AlertCircle,
      trend: "down"
    }
  ];

  const recentActivity = [
    { user: "user_1247", action: "deposit", amount: 500, time: "2 min ago" },
    { user: "user_0892", action: "withdrawal", amount: 250, time: "5 min ago" },
    { user: "user_2156", action: "referral", amount: 75, time: "12 min ago" },
    { user: "user_3401", action: "tier_upgrade", amount: 0, time: "18 min ago" }
  ];

  const systemAlerts = [
    { type: "warning", message: "High withdrawal volume detected", time: "10 min ago" },
    { type: "info", message: "Daily backup completed successfully", time: "1 hour ago" },
    { type: "success", message: "New security patch deployed", time: "2 hours ago" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <div className="bg-gradient-primary text-white p-6 border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-primary-foreground/80">Platform Management & Analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-white/20 text-white">
              <Shield className="w-3 h-3 mr-1" />
              Admin Access
            </Badge>
            <Button variant="glass" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminStats.map((stat, index) => (
            <FinanceCard key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className={`text-sm flex items-center gap-1 mt-1 ${
                    stat.trend === 'up' ? 'text-success' : 'text-destructive'
                  }`}>
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

        <Tabs defaultValue="activity" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="activity">Activity Monitor</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="alerts">System Alerts</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <FinanceCard className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Live Activity Feed
                  </CardTitle>
                </CardHeader>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{activity.user}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {activity.action.replace('_', ' ')}
                        </p>
                      </div>
                      <div className="text-right">
                        {activity.amount > 0 && (
                          <p className="font-semibold">${activity.amount}</p>
                        )}
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </FinanceCard>

              {/* System Health */}
              <FinanceCard className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Server Uptime</span>
                    <Badge variant="secondary" className="bg-success/10 text-success">99.98%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">API Response Time</span>
                    <Badge variant="secondary">127ms</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Database Status</span>
                    <Badge variant="secondary" className="bg-success/10 text-success">Healthy</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Security Status</span>
                    <Badge variant="secondary" className="bg-success/10 text-success">Secure</Badge>
                  </div>
                </div>
              </FinanceCard>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <FinanceCard className="p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  System Alerts
                </CardTitle>
              </CardHeader>
              <div className="space-y-3">
                {systemAlerts.map((alert, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${
                    alert.type === 'warning' ? 'bg-warning-light border-warning' :
                    alert.type === 'success' ? 'bg-success-light border-success' :
                    'bg-muted border-border'
                  }`}>
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{alert.message}</p>
                      <span className="text-xs text-muted-foreground">{alert.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </FinanceCard>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <FinanceCard className="p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts, verify documents, and handle support requests
                </CardDescription>
              </CardHeader>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Users className="w-6 h-6 mb-2" />
                  View All Users
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <FileText className="w-6 h-6 mb-2" />
                  Pending Verifications
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Settings className="w-6 h-6 mb-2" />
                  User Settings
                </Button>
              </div>
            </FinanceCard>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <FinanceCard className="p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle>Platform Reports</CardTitle>
                <CardDescription>
                  Generate and download platform analytics and compliance reports
                </CardDescription>
              </CardHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-16 justify-start">
                  <FileText className="w-5 h-5 mr-3" />
                  Financial Summary Report
                </Button>
                <Button variant="outline" className="h-16 justify-start">
                  <Users className="w-5 h-5 mr-3" />
                  User Growth Analytics
                </Button>
                <Button variant="outline" className="h-16 justify-start">
                  <TrendingUp className="w-5 h-5 mr-3" />
                  Performance Metrics
                </Button>
                <Button variant="outline" className="h-16 justify-start">
                  <Shield className="w-5 h-5 mr-3" />
                  Compliance Report
                </Button>
              </div>
            </FinanceCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}