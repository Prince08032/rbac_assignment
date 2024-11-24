'use client'
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import EntityForm from '../common/EntityForm';
import { useState } from 'react';
import EmptyState from '../ui/EmptyState';
import { FiKey } from 'react-icons/fi';
import Swal from 'sweetalert2';

const PermissionManagement = ({ permissions = [], onDelete, onSubmit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddPermission = () => {
    if (isProcessing) return;
    setEditingPermission(null);
    setIsModalOpen(true);
  };

  const handleEditPermission = (permission) => {
    if (isProcessing) return;
    setEditingPermission(permission);
    setIsModalOpen(true);
  };

  const handleDeletePermission = async (permissionId) => {
    try {
      // First check if permission is linked to any roles
      const response = await fetch(`/api/permissions/${permissionId}/check-usage`);
      const data = await response.json();

      if (data.isLinked) {
        // Show warning if permission is linked to roles
        await Swal.fire({
          title: 'Cannot Delete Permission',
          html: `This permission is currently used in the following roles:<br/><br/>${data.linkedRoles.join('<br/>')}`,
          icon: 'warning',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6',
        });
      } else {
        // Show confirmation dialog if permission can be deleted
        // const result = await Swal.fire({
        //   title: 'Are you sure?',
        //   text: "You won't be able to revert this!",
        //   icon: 'warning',
        //   showCancelButton: true,
        //   confirmButtonColor: '#3085d6',
        //   cancelButtonColor: '#d33',
        //   confirmButtonText: 'Yes, delete it!'
        // });

        // if (result.isConfirmed) {
        //   await onDelete(permissionId);
        //   Swal.fire(
        //     'Deleted!',
        //     'Permission has been deleted.',
        //     'success'
        //   );
        // }
        await onDelete(permissionId);
      }
    } catch (error) {
      console.error('Error checking permission usage:', error);
      Swal.fire(
        'Error',
        'An error occurred while checking permission usage.',
        'error'
      );
    }
  };

  const handleSubmit = async (permissionData) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await onSubmit(permissionData);
      setIsModalOpen(false);
      setEditingPermission(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Permission Management</h2>
        <Button onClick={handleAddPermission} disabled={isProcessing}>
          <FiPlus /> Add Permission
        </Button>
      </div>

      {permissions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {permissions.map((permission) => (
            <div 
              key={permission._id} 
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{permission.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{permission.description}</p>
                  <span className="mt-2 inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs px-2 py-1 rounded">
                    {permission.module}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="secondary" 
                    className="p-2" 
                    onClick={() => handleEditPermission(permission)}
                    disabled={isProcessing}
                  >
                    <FiEdit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="danger" 
                    className="p-2"
                    onClick={() => handleDeletePermission(permission._id)}
                    disabled={isProcessing}
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FiKey}
          title="No permissions defined"
          description="Add your first permission to get started"
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          if (!isProcessing) {
            setIsModalOpen(false);
            setEditingPermission(null);
          }
        }}
        title={editingPermission ? 'Edit Permission' : 'Add New Permission'}
      >
        <EntityForm
          type="permission"
          data={editingPermission}
          onSubmit={handleSubmit}
          onCancel={() => {
            if (!isProcessing) {
              setIsModalOpen(false);
              setEditingPermission(null);
            }
          }}
        />
      </Modal>
    </div>
  );
};

export default PermissionManagement; 