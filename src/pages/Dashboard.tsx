import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/DashboardLayout';
import { 
  Users, 
  Wallet, 
  ArrowLeftRight, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const { user } = useAuth();

  // Role-specific dashboard stats
  const getDashboardStats = () => {
    switch (user?.role) {
      case 'super_admin':
        return [
          { title: 'Total Users', value: '248', icon: Users, trend: '+12%', color: 'text-primary' },
          { title: 'Active Branches', value: '15', icon: TrendingUp, trend: '+2', color: 'text-success' },
          { title: 'System Health', value: '99.9%', icon: CheckCircle, trend: 'Optimal', color: 'text-success' },
          { title: 'Audit Logs', value: '1,247', icon: AlertCircle, trend: 'Today', color: 'text-warning' },
        ];
      case 'admin':
        return [
          { title: 'Total Users', value: '186', icon: Users, trend: '+8%', color: 'text-primary' },
          { title: 'Active Branches', value: '12', icon: TrendingUp, trend: 'All Active', color: 'text-success' },
          { title: 'Total Customers', value: '3,542', icon: Users, trend: '+24', color: 'text-accent' },
          { title: 'Pending Reports', value: '7', icon: AlertCircle, trend: 'Review', color: 'text-warning' },
        ];
      case 'head_department':
        return [
          { title: 'Pending Approvals', value: '23', icon: Clock, trend: 'Urgent: 5', color: 'text-warning' },
          { title: 'Transactions Today', value: '₹12.5M', icon: DollarSign, trend: '+18%', color: 'text-success' },
          { title: 'Active Accounts', value: '2,847', icon: Wallet, trend: '+142', color: 'text-accent' },
          { title: 'Staff Performance', value: '94%', icon: TrendingUp, trend: '+2%', color: 'text-success' },
        ];
      case 'branch_manager':
        return [
          { title: 'Pending Approvals', value: '15', icon: Clock, trend: 'Today', color: 'text-warning' },
          { title: 'Branch Transactions', value: '₹8.2M', icon: DollarSign, trend: '+12%', color: 'text-success' },
          { title: 'Branch Accounts', value: '1,247', icon: Wallet, trend: '+89', color: 'text-accent' },
          { title: 'Teller Balance', value: '₹2.5M', icon: TrendingUp, trend: 'In Vault', color: 'text-primary' },
        ];
      case 'staff':
        return [
          { title: 'Today Transactions', value: '47', icon: ArrowLeftRight, trend: '+12', color: 'text-primary' },
          { title: 'Cash Handled', value: '₹1.8M', icon: DollarSign, trend: 'Today', color: 'text-success' },
          { title: 'Pending Tasks', value: '8', icon: Clock, trend: '3 Urgent', color: 'text-warning' },
          { title: 'Customers Served', value: '34', icon: Users, trend: 'Today', color: 'text-accent' },
        ];
      default:
        return [];
    }
  };

  const stats = getDashboardStats();

  const recentActivities = [
    { action: 'Account opened', customer: 'Rajesh Kumar', time: '10 mins ago', status: 'pending' },
    { action: 'Cash deposit', customer: 'Priya Sharma', time: '25 mins ago', status: 'approved' },
    { action: 'NEFT transfer', customer: 'Amit Patel', time: '1 hour ago', status: 'approved' },
    { action: 'Account freeze request', customer: 'Sunita Verma', time: '2 hours ago', status: 'pending' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.fullName}
          </h1>
          <p className="text-muted-foreground mt-1">
            {user?.role.replace('_', ' ').toUpperCase()} • {user?.branchName || user?.departmentName || 'System'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.trend}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest transactions and requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.customer}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                      <Badge variant={activity.status === 'approved' ? 'default' : 'secondary'}>
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {user?.role === 'staff' && (
                  <>
                    <button className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left">
                      <Users className="w-5 h-5 text-primary mb-2" />
                      <p className="text-sm font-medium">New Customer</p>
                    </button>
                    <button className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left">
                      <Wallet className="w-5 h-5 text-accent mb-2" />
                      <p className="text-sm font-medium">Open Account</p>
                    </button>
                    <button className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left">
                      <DollarSign className="w-5 h-5 text-success mb-2" />
                      <p className="text-sm font-medium">Cash Deposit</p>
                    </button>
                    <button className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left">
                      <ArrowLeftRight className="w-5 h-5 text-warning mb-2" />
                      <p className="text-sm font-medium">Fund Transfer</p>
                    </button>
                  </>
                )}
                {(user?.role === 'branch_manager' || user?.role === 'head_department') && (
                  <>
                    <button className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left">
                      <CheckCircle className="w-5 h-5 text-success mb-2" />
                      <p className="text-sm font-medium">Approvals</p>
                    </button>
                    <button className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left">
                      <TrendingUp className="w-5 h-5 text-primary mb-2" />
                      <p className="text-sm font-medium">Reports</p>
                    </button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
