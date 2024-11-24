'use client'

import { useState, useEffect } from "react";
import { FaUserShield, FaUsers, FaKey } from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi";
import UserManagement from "@/components/management/UserManagement";
import RoleManagement from "@/components/management/RoleManagement";
import PermissionManagement from "@/components/management/PermissionManagement";
import { useSearchParams, useRouter } from 'next/navigation';
import AuthWrapper from '@/components/auth/AuthWrapper';
import { showSuccessAlert, showErrorAlert, showConfirmDialog } from '@/utils/alerts';

const RBACDashboard = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get('tab') || 'users';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Initial data load
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
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

      const [usersData, rolesData, permissionsData] = await Promise.all([
        usersRes.json(),
        rolesRes.json(),
        permissionsRes.json()
      ]);

      setUsers(usersData);
      setRoles(rolesData);
      setPermissions(permissionsData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Create/Update operations
  const handleSubmit = async (data, type) => {
    try {
      setLoading(true);
      const url = `/api/${type}s${data._id ? `/${data._id}` : ''}`;
      const method = data._id ? 'PUT' : 'POST';

      const dataToSubmit = type === 'role'
        ? { ...data, permissions: data.permissions || [] }
        : data;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save data');
      }

      await showSuccessAlert(`${type.charAt(0).toUpperCase() + type.slice(1)} ${data._id ? 'updated' : 'created'} successfully`);
      await loadData();
    } catch (error) {
      console.error('Error saving data:', error);
      showErrorAlert(error.message || `Failed to save ${type}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete operations
  const handleDelete = async (id, type) => {
    try {
      const result = await showConfirmDialog(
        'Delete Confirmation',
        `Are you sure you want to delete this ${type}?`
      );

      if (result.isConfirmed) {
        setLoading(true);
        const response = await fetch(`/api/${type}s/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete');

        await showSuccessAlert(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
        await loadData();
      }
    } catch (error) {
      console.error('Error deleting data:', error);
      showErrorAlert(`Failed to delete ${type}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle Status Change
  const handleStatusChange = async (userId, newStatus) => {
    try {
      const result = await showConfirmDialog(
        'Status Change',
        `Are you sure you want to ${newStatus ? 'activate' : 'deactivate'} this user?`
      );

      if (result.isConfirmed) {
        setLoading(true);
        const user = users.find(u => u._id === userId);
        if (!user) throw new Error('User not found');

        const response = await fetch(`/api/users/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...user,
            status: newStatus ? "Active" : "Inactive"
          })
        });

        if (!response.ok) throw new Error('Failed to update status');

        await showSuccessAlert('User status updated successfully');
        await loadData();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showErrorAlert('Failed to update user status');
    } finally {
      setLoading(false);
    }
  };

  // Handle Role Reordering
  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    try {
      const items = Array.from(roles);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      // Update the order in database
      // This would require a new API endpoint to handle bulk updates
      // For now, we'll just update the local state
      setRoles(items);
    } catch (error) {
      console.error('Error reordering roles:', error);
      setError(error.message);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', tab);
    router.push(`/userManage?${newParams.toString()}`, { scroll: false });
  };

  const tabComponents = {
    users: <UserManagement
      users={users}
      onDelete={(id) => handleDelete(id, "user")}
      onSubmit={(data) => handleSubmit(data, "user")}
      onSearch={handleSearch}
      onStatusChange={handleStatusChange}
      searchTerm={searchTerm}
    />,
    roles: <RoleManagement
      roles={roles}
      onDelete={(id) => handleDelete(id, "role")}
      onSubmit={(data) => handleSubmit(data, "role")}
      onDragEnd={handleDragEnd}
    />,
    permissions: <PermissionManagement
      permissions={permissions}
      onDelete={(id) => handleDelete(id, "permission")}
      onSubmit={(data) => handleSubmit(data, "permission")}
    />
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <h2 className="text-red-600 dark:text-red-400">Error: {error}</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthWrapper>

      <div className="h-[calc(100vh-2rem)] bg-gray-100 dark:bg-gray-900 p-4 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">User Management Dashboard</h1>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3">
            <div className="flex space-x-4 border-b dark:border-gray-700 mb-3">
              {['users', 'roles', 'permissions'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`flex items-center gap-2 px-3 py-2 border-b-2 transition-colors ${activeTab === tab
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    }`}
                >
                  {tab === 'users' && <FaUsers className="h-4 w-4" />}
                  {tab === 'roles' && <FaUserShield className="h-4 w-4" />}
                  {tab === 'permissions' && <FaKey className="h-4 w-4" />}
                  <span className="capitalize">{tab}</span>
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-48">
                <BiLoaderAlt className="animate-spin text-3xl text-blue-500 dark:text-blue-400" />
              </div>
            ) : (
              <div className="overflow-auto max-h-[calc(100vh-12rem)]">
                {tabComponents[activeTab]}
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default RBACDashboard; 