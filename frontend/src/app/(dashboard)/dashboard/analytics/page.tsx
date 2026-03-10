'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Package, Calendar, MessageSquare, FileText, Users, DollarSign } from 'lucide-react';

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    totalRevenue: 1250000,
    revenueGrowth: 12.5,
    totalBookings: 156,
    bookingsGrowth: 8.3,
    totalInquiries: 43,
    inquiriesGrowth: -5.2,
    totalCustomRequests: 18,
    customRequestsGrowth: 15.7,
    conversionRate: 32.5,
    averageBookingValue: 8012,
    popularTours: [
      { name: 'Royal Rajasthan Heritage Tour', bookings: 45, revenue: 450000 },
      { name: 'Desert Safari Adventure', bookings: 38, revenue: 380000 },
      { name: 'Jaipur City Tour', bookings: 32, revenue: 192000 },
      { name: 'Udaipur Lake Palace Tour', bookings: 25, revenue: 175000 },
      { name: 'Jaisalmer Fort Experience', bookings: 16, revenue: 128000 },
    ],
    monthlyRevenue: [
      { month: 'Jan', revenue: 95000 },
      { month: 'Feb', revenue: 105000 },
      { month: 'Mar', revenue: 125000 },
      { month: 'Apr', revenue: 115000 },
    ],
  });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your business performance and metrics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</span>
                <DollarSign className="text-green-500" size={20} />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold">₹{(stats.totalRevenue / 1000).toFixed(0)}K</p>
                  <div className="flex items-center gap-1 mt-1">
                    {stats.revenueGrowth > 0 ? (
                      <TrendingUp className="text-green-500" size={14} />
                    ) : (
                      <TrendingDown className="text-red-500" size={14} />
                    )}
                    <span className={`text-xs ${stats.revenueGrowth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {Math.abs(stats.revenueGrowth)}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</span>
                <Calendar className="text-blue-500" size={20} />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats.totalBookings}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {stats.bookingsGrowth > 0 ? (
                      <TrendingUp className="text-green-500" size={14} />
                    ) : (
                      <TrendingDown className="text-red-500" size={14} />
                    )}
                    <span className={`text-xs ${stats.bookingsGrowth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {Math.abs(stats.bookingsGrowth)}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Inquiries</span>
                <MessageSquare className="text-purple-500" size={20} />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats.totalInquiries}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {stats.inquiriesGrowth > 0 ? (
                      <TrendingUp className="text-green-500" size={14} />
                    ) : (
                      <TrendingDown className="text-red-500" size={14} />
                    )}
                    <span className={`text-xs ${stats.inquiriesGrowth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {Math.abs(stats.inquiriesGrowth)}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Custom Requests</span>
                <FileText className="text-orange-500" size={20} />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats.totalCustomRequests}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {stats.customRequestsGrowth > 0 ? (
                      <TrendingUp className="text-green-500" size={14} />
                    ) : (
                      <TrendingDown className="text-red-500" size={14} />
                    )}
                    <span className={`text-xs ${stats.customRequestsGrowth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {Math.abs(stats.customRequestsGrowth)}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">Conversion Metrics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</span>
                    <span className="text-lg font-bold text-green-600">{stats.conversionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                      style={{ width: `${stats.conversionRate}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Booking Value</span>
                    <span className="text-lg font-bold">₹{stats.averageBookingValue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">Monthly Revenue Trend</h3>
              <div className="space-y-3">
                {stats.monthlyRevenue.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.month}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-pink-500 h-2 rounded-full"
                          style={{ width: `${(item.revenue / 150000) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold w-16 text-right">
                        ₹{(item.revenue / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Popular Tours */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4">Top Performing Tours</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Tour Name</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Bookings</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.popularTours.map((tour, idx) => (
                    <tr key={idx} className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{tour.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm font-semibold">{tour.bookings}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm font-semibold text-green-600">
                          ₹{(tour.revenue / 1000).toFixed(0)}K
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
