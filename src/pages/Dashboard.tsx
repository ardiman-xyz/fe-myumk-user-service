import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTitle } from '@/hooks/useTitle';
import { 
  Users, 
  Shield, 
  Building, 
  Activity, 
  UserCheck, 
  Key,
  TrendingUp,
  Clock
} from 'lucide-react';

const Dashboard = () => {
  useTitle('Dashboard - User Service');

  // Mock data - nanti diganti dengan API call
  const stats = [
    {
      title: 'Total Users',
      value: '1,247',
      description: 'Active users in system',
      icon: Users,
      trend: '+12%',
      color: 'text-blue-600'
    },
    {
      title: 'Active Roles',
      value: '24',
      description: 'Configured roles',
      icon: Shield,
      trend: '+2',
      color: 'text-green-600'
    },
    {
      title: 'Applications',
      value: '8',
      description: 'Connected applications',
      icon: Building,
      trend: '0',
      color: 'text-purple-600'
    },
    {
      title: 'Daily Logins',
      value: '342',
      description: 'Today\'s login count',
      icon: Activity,
      trend: '+18%',
      color: 'text-orange-600'
    }
  ];

  const recentActivities = [
    {
      user: 'John Doe',
      action: 'Login',
      application: 'HR Management',
      time: '2 minutes ago',
      status: 'success'
    },
    {
      user: 'Jane Smith',
      action: 'Role Assignment',
      application: 'Finance System',
      time: '5 minutes ago',
      status: 'success'
    },
    {
      user: 'Mike Johnson',
      action: 'Failed Login',
      application: 'Inventory',
      time: '10 minutes ago',
      status: 'error'
    },
    {
      user: 'Sarah Wilson',
      action: 'Permission Update',
      application: 'CRM System',
      time: '15 minutes ago',
      status: 'success'
    },
    {
      user: 'David Brown',
      action: 'Login',
      application: 'HR Management',
      time: '20 minutes ago',
      status: 'success'
    }
  ];

  const topApplications = [
    { name: 'HR Management', users: 456, percentage: 85 },
    { name: 'Finance System', users: 234, percentage: 65 },
    { name: 'Inventory', users: 189, percentage: 45 },
    { name: 'CRM System', users: 123, percentage: 35 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to User Service Management System</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stat.description}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600 font-medium">{stat.trend}</span>
                <span className="text-xs text-gray-500 ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Recent Activities
            </CardTitle>
            <CardDescription>
              Latest user activities across all applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        <span className="font-semibold">{activity.user}</span> - {activity.action}
                      </p>
                      <p className="text-xs text-gray-500">{activity.application}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${
                        activity.status === 'success' ? 'bg-green-400' : 'bg-red-400'
                      }`}></span>
                      <Clock className="h-3 w-3 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-purple-600" />
              Application Usage
            </CardTitle>
            <CardDescription>
              Most used applications by user count
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topApplications.map((app, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{app.name}</span>
                    <span className="text-sm text-gray-600">{app.users} users</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${app.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-green-600" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Add New User', icon: Users, description: 'Create a new user account' },
              { title: 'Assign Role', icon: UserCheck, description: 'Assign roles to users' },
              { title: 'Manage Permissions', icon: Key, description: 'Configure role permissions' },
              { title: 'View Audit Logs', icon: Activity, description: 'Check system activity' }
            ].map((action, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer">
                <action.icon className="h-8 w-8 text-blue-600 mb-2" />
                <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                <p className="text-xs text-gray-500">{action.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;