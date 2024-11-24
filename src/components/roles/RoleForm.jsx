'use client'
import { useState, useEffect } from 'react';
import Button from '../ui/Button';

const RoleForm = ({ role, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: []
  });

  useEffect(() => {
    if (role) {
      setFormData(role);
    }
  }, [role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePermissionChange = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const availablePermissions = ['create', 'read', 'update', 'delete'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <div className="space-y-2">
          {availablePermissions.map(permission => (
            <label key={permission} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.permissions.includes(permission)}
                onChange={() => handlePermissionChange(permission)}
                className="rounded border-gray-300 dark:border-gray-600 
                         text-blue-500 dark:text-blue-400 
                         focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{permission}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {role ? 'Update Role' : 'Add Role'}
        </Button>
      </div>
    </form>
  );
};

export default RoleForm; 