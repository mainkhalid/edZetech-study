import React, { useState } from 'react';
import { 
  MdSchool, MdPeople, MdHelpCenter, MdLibraryBooks, MdTrendingUp,
  MdSmartToy, MdCheckCircle, MdError, MdSpeed, MdChat,
  MdInsights, MdSchedule, MdGroups, MdMonetizationOn, MdTimeline
} from 'react-icons/md';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('7d'); // 24h, 7d, 30d

  // Main stats
  const stats = [
    { label: 'Total Students', value: '2,847', change: '+12%', icon: <MdGroups />, color: 'bg-[#1a2b4c]' },
    { label: 'Active Scholarships', value: '24', change: '+3', icon: <MdMonetizationOn />, color: 'bg-[#1a2b4c]' },
    { label: 'AI Interactions', value: '1,234', change: '+28%', icon: <MdSmartToy />, color: 'bg-[#1a2b4c]' },
    { label: 'Portal Visits', value: '4.2k', change: '+15%', icon: <MdTrendingUp />, color: 'bg-[#1a2b4c]' },
  ];

  // AI Chatbot metrics
  const aiMetrics = {
    uptime: '99.8%',
    avgResponseTime: '1.2s',
    totalQueries: '1,234',
    successRate: '94.5%',
    activeNow: '23'
  };

  // Most asked AI tasks (top queries)
  const topAIQueries = [
    { task: 'Scholarship eligibility check', count: 342, percentage: 28 },
    { task: 'Application deadline info', count: 289, percentage: 23 },
    { task: 'Programme requirements', count: 234, percentage: 19 },
    { task: 'Fee structure inquiry', count: 178, percentage: 14 },
    { task: 'Club information', count: 123, percentage: 10 },
    { task: 'Document submission help', count: 68, percentage: 6 }
  ];

  // AI interaction trends (last 7 days)
  const aiTrendData = [
    { day: 'Mon', queries: 145, successful: 138, failed: 7 },
    { day: 'Tue', queries: 168, successful: 162, failed: 6 },
    { day: 'Wed', queries: 192, successful: 184, failed: 8 },
    { day: 'Thu', queries: 156, successful: 149, failed: 7 },
    { day: 'Fri', queries: 203, successful: 195, failed: 8 },
    { day: 'Sat', queries: 134, successful: 128, failed: 6 },
    { day: 'Sun', queries: 236, successful: 221, failed: 15 }
  ];

  // Response time distribution
  const responseTimeData = [
    { time: '0-1s', count: 687 },
    { time: '1-2s', count: 423 },
    { time: '2-3s', count: 98 },
    { time: '3-5s', count: 23 },
    { time: '>5s', count: 3 }
  ];

  // Category distribution for pie chart
  const categoryData = [
    { name: 'Scholarships', value: 342, color: '#10b981' },
    { name: 'Admissions', value: 289, color: '#3b82f6' },
    { name: 'Programmes', value: 234, color: '#8b5cf6' },
    { name: 'Fees', value: 178, color: '#f59e0b' },
    { name: 'Clubs', value: 123, color: '#ec4899' },
    { name: 'Other', value: 68, color: '#6b7280' }
  ];

  // Hourly activity pattern
  const hourlyActivity = [
    { hour: '00:00', activity: 12 },
    { hour: '03:00', activity: 8 },
    { hour: '06:00', activity: 45 },
    { hour: '09:00', activity: 134 },
    { hour: '12:00', activity: 187 },
    { hour: '15:00', activity: 156 },
    { hour: '18:00', activity: 98 },
    { hour: '21:00', activity: 67 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8 text-slate-900 w-full ">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-slate-500 mt-1">Welcome back, Admin. Here's your system overview.</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setTimeRange('24h')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  timeRange === '24h' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                24H
              </button>
              <button 
                onClick={() => setTimeRange('7d')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  timeRange === '7d' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                7D
              </button>
              <button 
                onClick={() => setTimeRange('30d')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  timeRange === '30d' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                30D
              </button>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-xl text-white text-2xl`}>
                  {stat.icon}
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-slate-800">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* AI Chatbot Status Section */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 rounded-2xl shadow-lg mb-8 text-white">
          <div className="flex items-center gap-3 mb-6">
            <MdSmartToy className="text-4xl" />
            <div>
              <h2 className="text-2xl font-bold">AI Assistant Status</h2>
              <p className="text-purple-100 text-sm">Real-time chatbot performance metrics</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <MdCheckCircle className="text-green-300" />
                <p className="text-xs font-bold text-purple-100 uppercase">Uptime</p>
              </div>
              <p className="text-2xl font-black">{aiMetrics.uptime}</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <MdSpeed className="text-blue-300" />
                <p className="text-xs font-bold text-purple-100 uppercase">Avg Response</p>
              </div>
              <p className="text-2xl font-black">{aiMetrics.avgResponseTime}</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <MdChat className="text-amber-300" />
                <p className="text-xs font-bold text-purple-100 uppercase">Total Queries</p>
              </div>
              <p className="text-2xl font-black">{aiMetrics.totalQueries}</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <MdInsights className="text-green-300" />
                <p className="text-xs font-bold text-purple-100 uppercase">Success Rate</p>
              </div>
              <p className="text-2xl font-black">{aiMetrics.successRate}</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <p className="text-xs font-bold text-purple-100 uppercase">Active Now</p>
              </div>
              <p className="text-2xl font-black">{aiMetrics.activeNow}</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* AI Interaction Trends */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <MdTimeline className="text-blue-600" />
              AI Interaction Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={aiTrendData}>
                <defs>
                  <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="queries" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorQueries)" name="Total Queries" />
                <Area type="monotone" dataKey="successful" stroke="#10b981" fillOpacity={1} fill="url(#colorSuccess)" name="Successful" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Query Categories Pie Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <MdInsights className="text-purple-600" />
              Query Distribution by Category
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* More Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Response Time Distribution */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <MdSpeed className="text-amber-600" />
              Response Time Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Hourly Activity Pattern */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <MdSchedule className="text-blue-600" />
              Hourly Activity Pattern
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hourlyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="hour" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="activity" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Most Asked Tasks */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <MdChat className="text-green-600" />
              Top AI Assistant Queries
            </h3>
            <div className="space-y-4">
              {topAIQueries.map((query, i) => (
                <div key={i} className="group hover:bg-slate-50 p-3 rounded-xl transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="bg-[#1a2b4c] text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">
                        {i + 1}
                      </span>
                      <span className="font-semibold text-slate-800">{query.task}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-600">{query.count} queries</span>
                  </div>
                  <div className="ml-11">
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 group-hover:scale-x-105"
                        style={{ width: `${query.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{query.percentage}% of total queries</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions & System Health */}
          <div className="space-y-6">
            {/* System Health */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <MdCheckCircle className="text-green-600" />
                System Health
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Database</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-green-600">Healthy</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">API Server</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-green-600">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">AI Service</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-green-600">Running</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Storage</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-600">72% Used</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <MdSchool className="text-blue-600" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <button className="p-3 border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 text-sm font-semibold text-left transition-all">
                  Add Programme
                </button>
                <button className="p-3 border border-slate-200 rounded-xl hover:bg-green-50 hover:border-green-200 text-sm font-semibold text-left transition-all">
                  New Scholarship
                </button>
                <button className="p-3 border border-slate-200 rounded-xl hover:bg-purple-50 hover:border-purple-200 text-sm font-semibold text-left transition-all">
                  Review AI Logs
                </button>
                <button className="p-3 border border-slate-200 rounded-xl hover:bg-amber-50 hover:border-amber-200 text-sm font-semibold text-left transition-all">
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;