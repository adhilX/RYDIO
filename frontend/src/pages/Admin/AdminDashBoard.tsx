import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  Car,
  DollarSign,
  TrendingUp,
  Calendar,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalVehicles: number;
  totalBookings: number;
  totalRevenue: number;
  pendingRequests: number;
  activeBookings: number;
}

interface RecentActivity {
  id: string;
  type: 'booking' | 'user' | 'vehicle' | 'payment';
  description: string;
  timestamp: string;
  status: 'success' | 'pending' | 'failed';
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 1247,
    totalVehicles: 89,
    totalBookings: 342,
    totalRevenue: 45670,
    pendingRequests: 12,
    activeBookings: 23
  });

  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'booking',
      description: 'New booking for Toyota Camry by John Doe',
      timestamp: '2 minutes ago',
      status: 'success'
    },
    {
      id: '2',
      type: 'vehicle',
      description: 'Vehicle verification request submitted',
      timestamp: '15 minutes ago',
      status: 'pending'
    },
    {
      id: '3',
      type: 'user',
      description: 'New user registration: Sarah Wilson',
      timestamp: '32 minutes ago',
      status: 'success'
    },
    {
      id: '4',
      type: 'payment',
      description: 'Payment failed for booking #BK-2024-001',
      timestamp: '1 hour ago',
      status: 'failed'
    },
    {
      id: '5',
      type: 'booking',
      description: 'Booking completed: Honda Civic',
      timestamp: '2 hours ago',
      status: 'success'
    }
  ]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }: {
    title: string;
    value: number | string;
    icon: any;
    trend?: 'up' | 'down';
    trendValue?: string;
    color: string;
  }) => (
    <motion.div variants={itemVariants}>
      <Card className="bg-black/60 border-gray-800 backdrop-blur-sm hover:bg-black/70 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">{title}</CardTitle>
          <Icon className={`h-4 w-4 ${color}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white mb-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          {trend && trendValue && (
            <div className="flex items-center text-xs">
              {trend === 'up' ? (
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                {trendValue}
              </span>
              <span className="text-gray-400 ml-1">from last month</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking': return Calendar;
      case 'user': return Users;
      case 'vehicle': return Car;
      case 'payment': return DollarSign;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-500';
      case 'pending': return 'text-yellow-500';
      case 'failed': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return CheckCircle;
      case 'pending': return Clock;
      case 'failed': return XCircle;
      default: return Clock;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <motion.div
        className="max-w-7xl mx-auto space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Welcome back! Here's what's happening with RYDIO today.</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              className="border-[#e63946] text-[#e63946] hover:bg-[#e63946] hover:text-white"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Reports
            </Button>
            <Button className="bg-[#e63946] hover:bg-[#e63946]/80 text-white">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6"
        >
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            trend="up"
            trendValue="+12.5%"
            color="text-blue-500"
          />
          <StatCard
            title="Total Vehicles"
            value={stats.totalVehicles}
            icon={Car}
            trend="up"
            trendValue="+8.2%"
            color="text-green-500"
          />
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings}
            icon={Calendar}
            trend="up"
            trendValue="+23.1%"
            color="text-purple-500"
          />
          <StatCard
            title="Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            trend="up"
            trendValue="+15.3%"
            color="text-yellow-500"
          />
          <StatCard
            title="Pending Requests"
            value={stats.pendingRequests}
            icon={AlertTriangle}
            color="text-orange-500"
          />
          <StatCard
            title="Active Bookings"
            value={stats.activeBookings}
            icon={MapPin}
            color="text-[#e63946]"
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="bg-black/60 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-white">Recent Activity</CardTitle>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => {
                    const ActivityIcon = getActivityIcon(activity.type);
                    const StatusIcon = getStatusIcon(activity.status);
                    return (
                      <motion.div
                        key={activity.id}
                        className="flex items-center space-x-4 p-3 rounded-lg bg-gray-900/50 hover:bg-gray-900/70 transition-colors"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                            <ActivityIcon className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{activity.description}</p>
                          <p className="text-xs text-gray-400">{activity.timestamp}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <StatusIcon className={`h-4 w-4 ${getStatusColor(activity.status)}`} />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <Card className="bg-black/60 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start bg-gray-900 hover:bg-gray-800 text-white border-gray-700"
                  variant="outline"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
                <Button 
                  className="w-full justify-start bg-gray-900 hover:bg-gray-800 text-white border-gray-700"
                  variant="outline"
                >
                  <Car className="h-4 w-4 mr-2" />
                  Add Vehicle
                </Button>
                <Button 
                  className="w-full justify-start bg-gray-900 hover:bg-gray-800 text-white border-gray-700"
                  variant="outline"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Review Requests
                </Button>
                <Button 
                  className="w-full justify-start bg-[#e63946] hover:bg-[#e63946]/80 text-white"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* System Status */}
        <motion.div variants={itemVariants}>
          <Card className="bg-black/60 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-white">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-sm text-white">API Status</p>
                    <p className="text-xs text-gray-400">Operational</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-sm text-white">Database</p>
                    <p className="text-xs text-gray-400">Healthy</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-sm text-white">Payment Gateway</p>
                    <p className="text-xs text-gray-400">Slow Response</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-sm text-white">Notifications</p>
                    <p className="text-xs text-gray-400">Active</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}