'use client'
import { useState, useEffect } from 'react';
import Button from '../ui/Button';

const UserForm = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Viewer',
    status: 'Active'
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

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

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Role
        </label>
        <select
          name="role"
          id="role"
          value={formData.role}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white
                   focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1"
        >
          <option value="Admin">Admin</option>
          <option value="Editor">Editor</option>
          <option value="Viewer">Viewer</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {user ? 'Update User' : 'Add User'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm; 