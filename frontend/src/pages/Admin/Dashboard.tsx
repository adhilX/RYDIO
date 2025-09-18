import React, { useState, useEffect } from 'react';
import { Car, MapPin, Loader2, Shield } from 'lucide-react';
import { getAllDashboardData} from '../../services/admin/dashboardService';
import type { DashboardData } from '@/Types/admin/dashboardType';
import { ChartLineLabel } from '@/components/chart-line-label';
import '../../styles/animations.css';

export const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllDashboardData();
      console.log('Dashboard data received:', data);
      console.log('Booking analytics:', data.bookingAnalytics);
      setDashboardData(data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard API error:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-black min-h-screen">
        {/* Skeleton for Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/10 p-6 rounded-2xl animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="h-3 skeleton rounded w-24 mb-4"></div>
              <div className="h-8 skeleton rounded w-20 mb-4"></div>
              <div className="h-2 skeleton rounded w-32 mb-4"></div>
              <div className="h-12 skeleton rounded"></div>
            </div>
          ))}
        </div>

        {/* Skeleton for Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Financial Overview Skeleton */}
          <div className="bg-white/10 p-6 rounded-2xl animate-pulse">
            <div className="h-5 bg-gray-600 rounded w-32 mb-6"></div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-gray-600 p-4 rounded-xl h-20"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-5 h-5 bg-gray-600 rounded"></div>
                  <div className="h-4 bg-gray-600 rounded flex-1"></div>
                  <div className="h-4 bg-gray-600 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>

          {/* User Management Skeleton */}
          <div className="bg-white/10 p-6 rounded-2xl animate-pulse">
            <div className="h-5 bg-gray-600 rounded w-32 mb-6"></div>
            <div className="flex items-center justify-center mb-6">
              <div className="w-32 h-32 bg-gray-600 rounded-full"></div>
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-4 bg-gray-600 rounded w-24"></div>
                  <div className="h-4 bg-gray-600 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skeleton for Third Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vehicle Management Skeleton */}
          <div className="bg-white/10 p-6 rounded-2xl animate-pulse">
            <div className="h-5 bg-gray-600 rounded w-32 mb-6"></div>
            <div className="space-y-4 mb-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    <div className="h-4 bg-gray-600 rounded w-16"></div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="h-4 bg-gray-600 rounded w-8"></div>
                    <div className="flex space-x-1">
                      <div className="w-6 h-6 bg-gray-600 rounded"></div>
                      <div className="w-6 h-6 bg-gray-600 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-600 p-4 rounded-lg h-16"></div>
          </div>

          {/* Booking Analytics Skeleton */}
          <div className="bg-white/10 p-6 rounded-2xl animate-pulse">
            <div className="h-5 bg-gray-600 rounded w-32 mb-6"></div>
            <div className="h-40 bg-gray-600 rounded mb-6"></div>
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-4 bg-gray-600 rounded w-20"></div>
                  <div className="h-4 bg-gray-600 rounded w-12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Loading indicator */}
        <div className="fixed top-4 right-4 flex items-center space-x-2 text-white bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="text-red-400 mb-4">{error}</div>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-[#e63946] text-white rounded hover:bg-[#d62828] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">No dashboard data available</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-black min-h-screen">
        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {/* Total Revenue Card */}
            <div className="bg-white/10 p-6 rounded-2xl text-white relative overflow-hidden card-hover">
                <div className="relative z-10">
                    <p className="text-xs text-gray-400 font-medium tracking-wide mb-2">TOTAL REVENUE</p>
                    <p className="text-3xl font-bold mb-4">
                        {dashboardData.totalRevenue.totalRevenue >= 1000000 
                            ? `₹${(dashboardData.totalRevenue.totalRevenue / 1000000).toFixed(1)}M`
                            : dashboardData.totalRevenue.totalRevenue >= 1000
                                ? `₹${(dashboardData.totalRevenue.totalRevenue / 1000).toFixed(1)}K`
                                : `₹${dashboardData.totalRevenue.totalRevenue.toLocaleString()}`
                        }
                    </p>
                    <div className="flex items-center mb-4">
                        <div className="w-2 h-2 bg-[#e63946] rounded-full mr-2"></div>
                        <p className="text-xs text-gray-400">Growth Comparison: {dashboardData.totalRevenue.growthPercentage > 0 ? '+' : ''}{dashboardData.totalRevenue.growthPercentage}% from last month</p>
                    </div>
                    {/* Mini Chart */}
                    <div className="h-12 flex items-end space-x-1">
                        {dashboardData.totalRevenue.chartData.map((height, i) => (
                            <div 
                                key={i} 
                                className="bg-gradient-to-t from-[#e63946]/30 to-[#e63946]/60 rounded-sm flex-1"
                                style={{ height: `${height}%` }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Total Bookings Card */}
            <div className="bg-white/10 p-6 rounded-2xl text-white relative overflow-hidden card-hover">
                <div className="relative z-10">
                    <p className="text-xs text-gray-400 font-medium tracking-wide mb-2">TOTAL BOOKINGS</p>
                    <p className="text-3xl font-bold mb-4">{dashboardData.totalBookings.totalBookings.toLocaleString()}</p>
                    <div className="flex items-center mb-4">
                        <div className="w-2 h-2 bg-[#e63946] rounded-full mr-2"></div>
                        <p className="text-xs text-gray-400">Growth Comparison: {dashboardData.totalBookings.growthPercentage > 0 ? '+' : ''}{dashboardData.totalBookings.growthPercentage}% from last month</p>
                    </div>
                    {/* Mini Chart */}
                    <div className="h-12 flex items-end space-x-1">
                        {dashboardData.totalBookings.chartData.map((height, i) => (
                            <div 
                                key={i} 
                                className="bg-gradient-to-t from-[#e63946]/30 to-[#e63946]/60 rounded-sm flex-1"
                                style={{ height: `${height}%` }}
                            />  
                        ))}
                    </div>
                </div>
            </div>

            {/* Total Users Card */}
            <div className="bg-white/10 p-6 rounded-2xl text-white relative overflow-hidden card-hover">
                <div className="relative z-10">
                    <p className="text-xs text-gray-400 font-medium tracking-wide mb-2">TOTAL USERS</p>
                    <p className="text-3xl font-bold mb-4">{dashboardData.totalUsers.totalUsers.toLocaleString()}</p>
                    <div className="flex items-center mb-4">
                        <div className="w-2 h-2 bg-[#e63946] rounded-full mr-2"></div>
                        <p className="text-xs text-gray-400">Growth Comparison: {dashboardData.totalUsers.growthPercentage > 0 ? '+' : ''}{dashboardData.totalUsers.growthPercentage}% from last month</p>
                    </div>
                    {/* Bar Chart */}
                    <div className="h-12 flex items-end justify-center space-x-2">
                        {dashboardData.totalUsers.chartData.map((height, i) => (
                            <div 
                                key={i} 
                                className="bg-[#e63946] rounded-sm w-3"
                                style={{ height: `${height}%` }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Active Vehicles Card */}
            <div className="bg-white/10 p-6 rounded-2xl text-white relative overflow-hidden card-hover">
                <div className="relative z-10">
                    <p className="text-xs text-gray-400 font-medium tracking-wide mb-2">ACTIVE VEHICLES</p>
                    <p className="text-3xl font-bold mb-4">{dashboardData.activeVehicles.activeVehicles.toLocaleString()}</p>
                    <div className="flex items-center mb-4">
                        <div className="w-2 h-2 bg-[#e63946] rounded-full mr-2"></div>
                        <p className="text-xs text-gray-400">Growth Comparison: {dashboardData.activeVehicles.growthPercentage > 0 ? '+' : ''}{dashboardData.activeVehicles.growthPercentage}% from last month</p>
                    </div>
                    {/* Mini Chart */}
                    <div className="h-12 flex items-end space-x-1">
                        {dashboardData.activeVehicles.chartData.map((height, i) => (
                            <div 
                                key={i} 
                                className="bg-gradient-to-t from-[#e63946]/30 to-[#e63946]/60 rounded-sm flex-1"
                                style={{ height: `${height}%` }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {/* Financial Overview */}
            <div className="bg-white/10 p-6 rounded-2xl shadow-sm">
                <h2 className="text-lg font-semibold text-white mb-6">FINANCIAL OVERVIEW</h2>
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-500 p-4 rounded-xl text-white text-center">
                        <div className="flex items-center justify-center mb-2">
                            <Car className="w-6 h-6 mr-2" />
                        </div>
                        <p className="text-xs font-medium mb-1">COMMISSION</p>
                        <p className="text-2xl font-bold">₹{(dashboardData.financialOverview.commission / 1000).toFixed(0)}K</p>
                    </div>
                    <div className="bg-gray-300 p-4 rounded-xl text-gray-700 text-center">
                        <div className="flex items-center justify-center mb-2">
                            <Shield className="w-6 h-6 mr-2" />
                        </div>
                        <p className="text-xs font-medium mb-1">PENALTIES</p>
                        <p className="text-2xl font-bold">₹{(dashboardData.financialOverview.penalties / 1000).toFixed(0)}K</p>
                    </div>
                    {/* <div className="bg-gray-300 p-4 rounded-xl text-gray-700 text-center">
                        <div className="flex items-center justify-center mb-2">
                            <CreditCard className="w-6 h-6 mr-2" />
                        </div>
                        <p className="text-xs font-medium mb-1">REFUNDS</p>
                        <p className="text-2xl font-bold">${(dashboardData.financialOverview.refunds / 1000).toFixed(0)}K</p>
                    </div> */}
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-white">TOP REVENUE VEHICLES</span>
                        <span className="text-white">WALLET BALANCE ₹{(dashboardData.financialOverview.walletBalance / 1000).toFixed(0)}K</span>
                    </div>
                    {dashboardData.financialOverview.topRevenueVehicles.map((vehicle, index) => (
                        <div key={index} className="flex items-center space-x-4 text-white">
                            <Car className="w-5 h-5 text-gray-400" />
                            <span className="text-sm min-w-0 flex-1">{vehicle.type.toUpperCase()} ({vehicle.model.toUpperCase()})</span>
                            <div className="flex items-center space-x-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${vehicle.percentage}%` }}></div>
                                </div>
                                <span className="text-sm font-medium text-white">₹{(vehicle.revenue / 1000).toFixed(0)}K</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* User Management */}
            <div className="bg-white/10 p-6 rounded-2xl text-white">
                <h2 className="text-lg font-semibold mb-6">USER MANAGEMENT</h2>
                <div className="flex items-center justify-center mb-6">
                    <div className="relative w-32 h-32">
                        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#374151"
                                strokeWidth="3"
                            />
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#e63946"
                                strokeWidth="3"
                                strokeDasharray={`${dashboardData.userManagement.activePercentage}, 100`}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-3xl font-bold">{dashboardData.userManagement.activePercentage}%</p>
                                <p className="text-xs text-gray-400">{dashboardData.userManagement.totalUsers.toLocaleString()} USERS</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">ACTIVE VS BLOCKED USERS</span>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-[#e63946] rounded-full"></div>
                            <span className="text-sm text-gray-300">{dashboardData.userManagement.blockedPercentage}% Blocked</span>
                            <span className="text-sm text-white">{dashboardData.userManagement.blockedUsers.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">VENDOR ACCESS REQUESTS</span>
                        <span className="text-sm text-white">{dashboardData.userManagement.vendorAccessRequests} PENDING</span>
                    </div>
                    <div className="bg-gray-700/50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">VERIFICATION REQUESTS</span>
                            <span className="text-sm text-[#e63946]">{dashboardData.userManagement.verificationRequests} PENDING</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500">VERIFIED REQUESTS</span>
                            <span className="text-xs text-[#e63946]">{dashboardData.userManagement.verificationRequests} PENDING</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            {/* Vehicle Management */}
            <div className="bg-white/10 p-6 rounded-2xl text-white">
                <h2 className="text-lg font-semibold mb-6">VEHICLE MANAGEMENT</h2>
                <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-[#e63946] rounded-full"></div>
                            <span className="text-sm">PENDING</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm">{dashboardData.vehicleManagement.pendingVehicles}</span>
                            <div className="flex space-x-1">
                                <Car className="w-6 h-6 text-gray-400" />
                                <Car className="w-6 h-6 text-red-400" />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm">APPROVED</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm">{dashboardData.vehicleManagement.approvedVehicles}</span>
                            <div className="flex space-x-1">
                                <Car className="w-6 h-6 text-gray-400" />
                                <Car className="w-6 h-6 text-red-400" />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-sm">REJECTED</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm">{dashboardData.vehicleManagement.rejectedVehicles}</span>
                            <div className="flex space-x-1">
                                <Car className="w-6 h-6 text-gray-400" />
                                <Car className="w-6 h-6 text-blue-400" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">AVERAGE REVENUE PER BOOKING</span>
                        <span className="text-lg font-bold">₹{dashboardData.vehicleManagement.averageRevenuePerBooking}</span>
                    </div>
                </div>
            </div>

            {/* Booking Analytics */}
            <div className="bg-white/10 p-6 rounded-2xl text-white">
                <h2 className="text-lg font-semibold mb-6">BOOKING ANALYTICS</h2>
                <div className="h-40 mb-6 chart-enter">
                    {dashboardData?.bookingAnalytics?.chartData && dashboardData.bookingAnalytics.chartData.length > 0 ? (
                        <ChartLineLabel data={dashboardData.bookingAnalytics.chartData} />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            No data available
                        </div>
                    )}
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">ACTIVE CITIES</span>
                        <span className="text-sm font-medium">{dashboardData?.bookingAnalytics?.activeCities || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-[#e63946]" />
                            <span className="text-sm">TOP CITY {dashboardData?.bookingAnalytics?.topCity?.name?.toUpperCase() || 'N/A'}</span>
                        </div>
                        <span className="text-sm">({dashboardData?.bookingAnalytics?.topCity?.bookings?.toLocaleString() || 0} BOOKINGS)</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
