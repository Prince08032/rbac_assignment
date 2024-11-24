'use client'
import { useState, useEffect } from 'react';
import Button from '../ui/Button';

const PermissionForm = ({ permission, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    module: 'Core'
  });

  useEffect(() => {
    if (permission) {
      setFormData(permission);
    }
  }, [permission]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        >
          <option value="Core">Core</option>
          <option value="Users">Users</option>
          <option value="Content">Content</option>
          <option value="Settings">Settings</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {permission ? 'Update Permission' : 'Add Permission'}
        </Button>
      </div>
    </form>
  );
};

export default PermissionForm; 