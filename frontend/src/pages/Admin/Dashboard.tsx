import React, { useState, useEffect } from 'react';
import { Car, MapPin,Loader2, Shield, CreditCard } from 'lucide-react';
import { getAllDashboardData, type DashboardData } from '../../services/admin/dashboardService';

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
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="flex items-center space-x-2 text-white">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
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
    return null;
  }

  return (
    <div className="p-6 space-y-6 bg-black min-h-screen">
        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Revenue Card */}
            <div className="bg-white/10 p-6 rounded-2xl text-white relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-xs text-gray-400 font-medium tracking-wide mb-2">TOTAL REVENUE</p>
                    <p className="text-3xl font-bold mb-4">
                        {dashboardData.totalRevenue.totalRevenue >= 1000000 
                            ? `$${(dashboardData.totalRevenue.totalRevenue / 1000000).toFixed(1)}M`
                            : dashboardData.totalRevenue.totalRevenue >= 1000
                                ? `$${(dashboardData.totalRevenue.totalRevenue / 1000).toFixed(1)}K`
                                : `$${dashboardData.totalRevenue.totalRevenue.toLocaleString()}`
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
            <div className="bg-white/10 p-6 rounded-2xl text-white relative overflow-hidden">
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
            <div className="bg-white/10 p-6 rounded-2xl text-white relative overflow-hidden">
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
            <div className="bg-white/10 p-6 rounded-2xl text-white relative overflow-hidden">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Financial Overview */}
            <div className="bg-white/10 p-6 rounded-2xl shadow-sm">
                <h2 className="text-lg font-semibold text-white mb-6">FINANCIAL OVERVIEW</h2>
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-500 p-4 rounded-xl text-white text-center">
                        <div className="flex items-center justify-center mb-2">
                            <Car className="w-6 h-6 mr-2" />
                        </div>
                        <p className="text-xs font-medium mb-1">COMMISSION</p>
                        <p className="text-2xl font-bold">${(dashboardData.financialOverview.commission / 1000).toFixed(0)}K</p>
                    </div>
                    <div className="bg-gray-300 p-4 rounded-xl text-gray-700 text-center">
                        <div className="flex items-center justify-center mb-2">
                            <Shield className="w-6 h-6 mr-2" />
                        </div>
                        <p className="text-xs font-medium mb-1">PENALTIES</p>
                        <p className="text-2xl font-bold">${(dashboardData.financialOverview.penalties / 1000).toFixed(0)}K</p>
                    </div>
                    <div className="bg-gray-300 p-4 rounded-xl text-gray-700 text-center">
                        <div className="flex items-center justify-center mb-2">
                            <CreditCard className="w-6 h-6 mr-2" />
                        </div>
                        <p className="text-xs font-medium mb-1">REFUNDS</p>
                        <p className="text-2xl font-bold">${(dashboardData.financialOverview.refunds / 1000).toFixed(0)}K</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-white">TOP REVENUE VEHICLES</span>
                        <span className="text-white">WALLET BALANCE ${(dashboardData.financialOverview.walletBalance / 1000).toFixed(0)}K</span>
                    </div>
                    {dashboardData.financialOverview.topRevenueVehicles.map((vehicle, index) => (
                        <div key={index} className="flex items-center space-x-4 text-white">
                            <Car className="w-5 h-5 text-gray-400" />
                            <span className="text-sm min-w-0 flex-1">{vehicle.type.toUpperCase()} ({vehicle.model.toUpperCase()})</span>
                            <div className="flex items-center space-x-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${vehicle.percentage}%` }}></div>
                                </div>
                                <span className="text-sm font-medium text-white">${(vehicle.revenue / 1000).toFixed(0)}K</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                        <span className="text-lg font-bold">${dashboardData.vehicleManagement.averageRevenuePerBooking}</span>
                    </div>
                </div>
            </div>

            {/* Booking Analytics */}
            <div className="bg-white/10 p-6 rounded-2xl text-white">
                <h2 className="text-lg font-semibold mb-6">BOOKING ANALYTICS</h2>
                <div className="h-40 mb-6 relative">
                    <svg className="w-full h-full" viewBox="0 0 400 160">
                        {/* Grid lines */}
                        <defs>
                            <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                        
                        {/* Chart line */}
                        <polyline
                            fill="none"
                            stroke="#e63946"
                            strokeWidth="3"
                            points="20,140 60,120 100,100 140,80 180,70 220,60 260,50 300,40 340,30 380,25"
                        />
                        
                        {/* Data points */}
                        <circle cx="20" cy="140" r="4" fill="#e63946" />
                        <circle cx="60" cy="120" r="4" fill="#e63946" />
                        <circle cx="100" cy="100" r="4" fill="#e63946" />
                        <circle cx="140" cy="80" r="4" fill="#e63946" />
                        <circle cx="180" cy="70" r="4" fill="#e63946" />
                        <circle cx="220" cy="60" r="4" fill="#e63946" />
                        <circle cx="260" cy="50" r="4" fill="#e63946" />
                        <circle cx="300" cy="40" r="4" fill="#e63946" />
                        <circle cx="340" cy="30" r="4" fill="#e63946" />
                        <circle cx="380" cy="25" r="4" fill="#e63946" />
                    </svg>
                    
                    {/* X-axis labels */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400 px-2">
                        <span>MON</span>
                        <span>TUE</span>
                        <span>WED</span>
                        <span>THU</span>
                        <span>FRI</span>
                        <span>SAT</span>
                        <span>SUN</span>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">ACTIVE CITIES</span>
                        <span className="text-sm font-medium">{dashboardData.bookingAnalytics.activeCities}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-[#e63946]" />
                            <span className="text-sm">TOP CITY {dashboardData.bookingAnalytics.topCity.name.toUpperCase()}</span>
                        </div>
                        <span className="text-sm">({dashboardData.bookingAnalytics.topCity.bookings.toLocaleString()} BOOKINGS)</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
