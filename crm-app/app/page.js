'use client';

import { useState, useEffect } from 'react';

// Reusable StatCard Component
function StatCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    gold: 'from-amber-500 to-amber-600',
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-10`}></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">{title}</h3>
          <span className="text-2xl">{icon}</span>
        </div>
        <p className="text-4xl font-bold text-white">{value?.toLocaleString() || '0'}</p>
      </div>
    </div>
  );
}

// Reusable ProgressBar Component
function ProgressBar({ label, current, target, color }) {
  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;

  const colorClasses = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    gold: 'bg-amber-500',
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-semibold text-white">{label}</h3>
        <span className="text-sm text-slate-400">
          {current?.toLocaleString() || '0'} / {target?.toLocaleString() || '0'}
        </span>
      </div>
      <div className="relative w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
        <div
          className={`absolute top-0 left-0 h-full ${colorClasses[color]} transition-all duration-700 ease-out rounded-full shadow-lg`}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
        </div>
      </div>
      <p className="text-right text-sm font-medium text-slate-300 mt-2">
        {percentage.toFixed(1)}%
      </p>
    </div>
  );
}

// Main Dashboard Component
export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set default data on error
        setData({
          totalContacts: 0,
          dmsSent: 0,
          replies: 0,
          dealsClosed: 0,
          emailsSent: 0,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
          <p className="text-white text-xl font-semibold">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Bespoke Ethos CRM
          </h1>
          <p className="text-slate-400 text-lg">Dashboard Overview</p>
        </div>

        {/* Stats Grid - 4 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Total Contacts"
            value={data?.totalContacts}
            icon="👥"
            color="blue"
          />
          <StatCard
            title="DMs Sent"
            value={data?.dmsSent}
            icon="💬"
            color="purple"
          />
          <StatCard
            title="Replies"
            value={data?.replies}
            icon="✉️"
            color="green"
          />
          <StatCard
            title="Deals Closed"
            value={data?.dealsClosed}
            icon="🎯"
            color="gold"
          />
        </div>

        {/* Progress Bars Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Campaign Progress</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ProgressBar
              label="DMs Sent"
              current={data?.dmsSent}
              target={343}
              color="purple"
            />
            <ProgressBar
              label="Emails Sent"
              current={data?.emailsSent}
              target={343}
              color="blue"
            />
            <ProgressBar
              label="Replies"
              current={data?.replies}
              target={103}
              color="green"
            />
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-3">Quick Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-slate-400 text-sm mb-1">Response Rate</p>
              <p className="text-2xl font-bold text-green-400">
                {data?.dmsSent > 0
                  ? ((data?.replies / data?.dmsSent) * 100).toFixed(1)
                  : '0.0'}%
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Conversion Rate</p>
              <p className="text-2xl font-bold text-amber-400">
                {data?.replies > 0
                  ? ((data?.dealsClosed / data?.replies) * 100).toFixed(1)
                  : '0.0'}%
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Total Outreach</p>
              <p className="text-2xl font-bold text-blue-400">
                {((data?.dmsSent || 0) + (data?.emailsSent || 0)).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Avg per Contact</p>
              <p className="text-2xl font-bold text-purple-400">
                {data?.totalContacts > 0
                  ? (((data?.dmsSent || 0) + (data?.emailsSent || 0)) / data?.totalContacts).toFixed(1)
                  : '0.0'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
