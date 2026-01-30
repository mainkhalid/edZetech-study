import React from 'react';
import { MdSchool, MdPeople, MdHelpCenter, MdLibraryBooks, MdTrendingUp } from 'react-icons/md';

const Dashboard = () => {
  const stats = [
    { label: 'Total Programmes', value: '42', icon: <MdLibraryBooks />, color: 'bg-blue-500' },
    { label: 'Active Scholarships', value: '12', icon: <MdPeople />, color: 'bg-green-500' },
    { label: 'Unresolved FAQs', value: '5', icon: <MdHelpCenter />, color: 'bg-amber-500' },
    { label: 'Portal Visits', value: '1.2k', icon: <MdTrendingUp />, color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold">System Overview</h1>
          <p className="text-slate-500">Welcome back, Admin. Here is what's happening today.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
              <div className={`${stat.color} p-3 rounded-xl text-white text-2xl`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-black text-slate-800">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold mb-4 flex items-center gap-2"><MdSchool className="text-blue-600"/> Quick Management</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 text-sm font-semibold text-left">Add New Programme</button>
              <button className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 text-sm font-semibold text-left">Update Fees</button>
              <button className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 text-sm font-semibold text-left">Review FAQs</button>
              <button className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 text-sm font-semibold text-left">Generate Report</button>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold mb-4">Recent Updates</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex gap-4 pb-4 border-b border-slate-50 last:border-0">
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-400 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-800">New FAQ added to 'Admissions'</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;