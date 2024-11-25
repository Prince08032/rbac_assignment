'use client'
import { useState, useEffect } from 'react';
import { FiPlus, FiUsers } from "react-icons/fi";
import Button from "../ui/Button";
import SearchInput from "../ui/SearchInput";
import UserTable from "../users/UserTable";
import Modal from "../ui/Modal";
import EntityForm from '../common/EntityForm';
import EmptyState from '../ui/EmptyState';
import Swal from 'sweetalert2';

const UserManagement = ({ users = [], onDelete, onSearch, onStatusChange, onSubmit, searchTerm }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch current user on component mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/auth/user');
        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  const isAdminUser = (user) => {
    return user.roles?.some(role => role.name === 'Admin') && user.status === 'Active';
  };

  const isCurrentUser = (userId) => {
    return currentUser?._id === userId;
  };

  const filteredUsers = Array.isArray(users) ? users.filter(user => 
    user.name?.toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    user.email?.toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    user.role?.toLowerCase().includes((searchTerm || '').toLowerCase())
  ) : [];

  const handleAddUser = () => {
    if (isProcessing) return;
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    if (isProcessing) return;
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSubmit = async (userData) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await onSubmit(userData);
      setIsModalOpen(false);
      setEditingUser(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const user = users.find(u => u._id === userId);
      
      // Check if trying to delete current user
      if (isCurrentUser(userId)) {
        await Swal.fire({
          title: 'Cannot Delete Current User',
          text: 'You cannot delete your own account while logged in.',
          icon: 'warning',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6',
        });
        return;
      }

      // Check if trying to delete active admin
      if (isAdminUser(user)) {
        await Swal.fire({
          title: 'Cannot Delete Active Admin',
          text: 'Active admin users cannot be deleted from the system. Please deactivate the user first.',
          icon: 'warning',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6',
        });
        return;
      }

      const response = await fetch(`/api/users/${userId}/check-usage`);
      const data = await response.json();

      if (data.isLinked) {
        await Swal.fire({
          title: 'Cannot Delete User',
          html: `This user has the following dependencies:<br/><br/>${data.dependencies.join('<br/>')}`,
          icon: 'warning',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6',
        });
      } else {
        // Just call onDelete directly without confirmation - let parent handle it
        await onDelete(userId);
      }
    } catch (error) {
      console.error('Error checking user dependencies:', error);
      Swal.fire(
        'Error',
        'An error occurred while checking user dependencies.',
        'error'
      );
    }
  };

  const hasAddPermission = () => {
    return currentUser?.roles?.some(role => 
      role.name === "Admin"
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">User Management</h2>
        {hasAddPermission() && (
          <Button onClick={handleAddUser} disabled={isProcessing}>
            <FiPlus /> Add User
          </Button>
        )}
      </div>
      
      {users.length > 0 ? (
        <>
          <SearchInput 
            placeholder="Search users..."
            onChange={onSearch}
            value={searchTerm}
          />
          {filteredUsers.length > 0 ? (
            <UserTable 
              users={filteredUsers}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
              onEdit={handleEditUser}
              onDeleteClick={handleDeleteUser}
              currentUserRoles={currentUser?.roles}
            />
          ) : (
            <EmptyState
              icon={FiUsers}
              title="No users found"
              description="Try adjusting your search terms"
            />
          )}
        </>
      ) : (
        <EmptyState
          icon={FiUsers}
          title="No users yet"
          description="Add your first user to get started"
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          if (!isProcessing) {
            setIsModalOpen(false);
            setEditingUser(null);
          }
        }}
        title={editingUser ? 'Edit User' : 'Add New User'}
      >
        <EntityForm
          type="user"
          data={editingUser}
          onSubmit={handleSubmit}
          onCancel={() => {
            if (!isProcessing) {
              setIsModalOpen(false);
              setEditingUser(null);
            }
          }}
        />
      </Modal>
    </div>
  );
};

export default UserManagement; 