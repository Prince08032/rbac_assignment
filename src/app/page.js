'use client'
import { useState, useEffect } from "react";
import { FiUsers, FiShield, FiKey, FiActivity } from "react-icons/fi";
import Link from "next/link";
import AuthWrapper from '@/components/auth/AuthWrapper';

const DashboardCard = ({ icon: Icon, title, value, description, color }) => (
  <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
      </div>
    </div>
  </div>
);

const ActivityItem = ({ title, time, type }) => (
  <div className="flex items-center gap-4 py-3">
    <div className={`w-2 h-2 rounded-full ${
      type === 'create' ? 'bg-green-500' : 
      type === 'update' ? 'bg-blue-500' : 
      'bg-red-500'
    }`} />
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{title}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{time}</p>
    </div>
  </div>
);

export default function Home() {
  const [stats, setStats] = useState({
    users: 0,
    roles: 0,
    permissions: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [usersRes, rolesRes, permissionsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/roles'),
        fetch('/api/permissions')
      ]);

      if (!usersRes.ok || !rolesRes.ok || !permissionsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [users, roles, permissions] = await Promise.all([
        usersRes.json(),
        rolesRes.json(),
        permissionsRes.json()
      ]);

      setStats({
        users: users.length,
        roles: roles.length,
        permissions: permissions.length
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-[calc(100vh-2rem)] p-8">
        <div className="bg-red-50 dark:bg-red-900/50 p-4 rounded-lg">
          <p className="text-red-600 dark:text-red-400">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-2rem)] p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AuthWrapper>
      <div className="min-h-[calc(100vh-2rem)] p-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Welcome to your RBAC dashboard</p>
          </div>
          <Link 
            href="/userManage"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to RBAC
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            icon={FiUsers}
            title="Total Users"
            value={stats.users}
            description={`${stats.users} active users in the system`}
            color="bg-blue-500"
          />
          <DashboardCard
            icon={FiShield}
            title="Active Roles"
            value={stats.roles}
            description={`${stats.roles} roles configured`}
            color="bg-green-500"
          />
          <DashboardCard
            icon={FiKey}
            title="Permissions"
            value={stats.permissions}
            description={`${stats.permissions} permissions defined`}
            color="bg-purple-500"
          />
        </div>

        {/* Activity and Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Activity</h2>
              <button className="text-blue-500 text-sm hover:underline">View all</button>
            </div>
            <div className="space-y-1">
              <ActivityItem
                title={`${stats.users} users in the system`}
                time="Current Status"
                type="create"
              />
              <ActivityItem
                title={`${stats.roles} roles configured`}
                time="Current Status"
                type="update"
              />
              <ActivityItem
                title={`${stats.permissions} permissions set`}
                time="Current Status"
                type="create"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Quick Actions</h2>
            <div className="space-y-3">
              <Link 
                href="/userManage?tab=users"
                className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FiUsers className="h-5 w-5 text-blue-500" />
                <span className="text-gray-700 dark:text-gray-300">Manage Users</span>
              </Link>
              <Link 
                href="/userManage?tab=roles"
                className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FiShield className="h-5 w-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Configure Roles</span>
              </Link>
              <Link 
                href="/userManage?tab=permissions"
                className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FiKey className="h-5 w-5 text-purple-500" />
                <span className="text-gray-700 dark:text-gray-300">Set Permissions</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}
