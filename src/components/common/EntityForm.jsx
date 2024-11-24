'use client'
import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import { FiShield, FiKey } from 'react-icons/fi';

const generatePassword = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const EntityForm = ({ type, data, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roles: [],
    status: 'Active',
    description: '',
    module: 'Core',
  });

  const [availableRoles, setAvailableRoles] = useState([]);
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch available data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (type === 'user') {
          const rolesRes = await fetch('/api/roles');
          if (!rolesRes.ok) {
            throw new Error('Failed to fetch roles');
          }
          const rolesData = await rolesRes.json();
          setAvailableRoles(rolesData);
        } else if (type === 'role') {
          const permissionsRes = await fetch('/api/permissions');
          if (!permissionsRes.ok) {
            throw new Error('Failed to fetch permissions');
          }
          const permissionsData = await permissionsRes.json();
          setAvailablePermissions(permissionsData);
        }
      } catch (error) {
        console.error('Error fetching form data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type]);

  // Set initial form data when editing
  useEffect(() => {
    if (data) {
      setFormData({
        ...data,
        password: '',
        roles: data.roles?.map(r => r._id) || []
      });
    }
  }, [data, type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (roleId) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(roleId)
        ? prev.roles.filter(r => r !== roleId)
        : [...prev.roles, roleId]
    }));
  };

  const handlePermissionChange = (permissionId) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions?.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...(prev.permissions || []), permissionId]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create base submission data without password
    const submissionData = {
      name: formData.name,
      email: formData.email,
      roles: formData.roles || [],
      status: formData.status || 'Active'
    };

    // Add _id for updates
    if (data?._id) {
      submissionData._id = data._id;
      
      // Only include password in update if it's explicitly changed
      if (formData.password && formData.password.trim().length > 0) {
        submissionData.password = formData.password.trim();
      }
    } else {
      // New user - password required
      submissionData.password = formData.password;
    }
    
    onSubmit(submissionData);
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    setFormData(prev => ({
      ...prev,
      password: newPassword
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Add error handling for when roles/permissions fail to load
  if (type === 'user' && availableRoles.length === 0) {
    return (
      <EmptyState
        icon={FiShield}
        title="No roles available"
        description="Please create roles first before adding users"
      />
    );
  }

  const renderFields = () => {
    switch (type) {
      case 'user':
        return (
          <>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white
                         focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white
                         focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1"
                required
              />
            </div>
            {!data && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white
                             focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1"
                    required
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleGeneratePassword}
                    className="mt-1 whitespace-nowrap"
                  >
                    Generate
                  </Button>
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Roles
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded">
                {availableRoles.map(role => (
                  <label key={role._id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.roles.includes(role._id)}
                      onChange={() => handleRoleChange(role._id)}
                      className="rounded border-gray-300 dark:border-gray-600 
                               text-blue-500 dark:text-blue-400 
                               focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {role.name}
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        ({role.description})
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </>
        );

      case 'role':
        return (
          <>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white
                         focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white
                         focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Permissions
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded">
                {availablePermissions.map(permission => (
                  <label key={permission._id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.permissions?.includes(permission._id)}
                      onChange={() => handlePermissionChange(permission._id)}
                      className="rounded border-gray-300 dark:border-gray-600 
                               text-blue-500 dark:text-blue-400 
                               focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {permission.name}
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        ({permission.module})
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </>
        );

      case 'permission':
        return (
          <>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Permission Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white
                         focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white
                         focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1"
                required
              />
            </div>
            <div>
              <label htmlFor="module" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Module
              </label>
              <select
                name="module"
                id="module"
                value={formData.module}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white
                         focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1"
                required
              >
                {['Core', 'Users', 'Content', 'Settings'].map(module => (
                  <option key={module} value={module}>
                    {module}
                  </option>
                ))}
              </select>
            </div>
          </>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {renderFields()}
      <div className="flex justify-end space-x-3 mt-6">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {data ? `Update ${type}` : `Add ${type}`}
        </Button>
      </div>
    </form>
  );
};

export default EntityForm; 