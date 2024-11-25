'use client'
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import EntityForm from '../common/EntityForm';
import { useState, useEffect } from 'react';
import EmptyState from '../ui/EmptyState';
import { FiShield } from 'react-icons/fi';
import Swal from 'sweetalert2';

const SortableRole = ({ role, onDelete, onEdit, currentUser }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: role._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isAdmin = currentUser?.roles?.some(role => role.name === 'admin' || role.name === 'Admin');

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700 cursor-move"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{role.name}</h3>
          <p className="text-gray-600 dark:text-gray-400">{role.description}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {role.permissions?.map((permission) => (
              <span 
                key={permission._id} 
                className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded"
              >
                {permission.name}
              </span>
            ))}
          </div>
        </div>
        {isAdmin && (
          <div className="flex space-x-2">
            <Button 
              variant="secondary" 
              className="p-2"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(role);
              }}
              disabled={role.isProcessing}
            >
              <FiEdit className="h-4 w-4" />
            </Button>
            <Button 
              variant="danger" 
              className="p-2"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(role._id);
              }}
              disabled={role.isProcessing}
            >
              <FiTrash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const RoleManagement = ({ roles = [], onDelete, onDragEnd, onSubmit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      onDragEnd({
        source: { index: roles.findIndex(role => role._id === active.id) },
        destination: { index: roles.findIndex(role => role._id === over.id) }
      });
    }
  };

  const handleAddRole = () => {
    if (isProcessing) return;
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const handleEditRole = (role) => {
    if (isProcessing) return;
    setEditingRole(role);
    setIsModalOpen(true);
  };

  const handleSubmit = async (roleData) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const dataToSubmit = {
        ...roleData,
        permissions: roleData.permissions || []
      };
      await onSubmit(dataToSubmit);
      setIsModalOpen(false);
      setEditingRole(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteRole = async (roleId) => {
    try {
      // First check if role is linked to any users
      const response = await fetch(`/api/roles/${roleId}/check-usage`);
      const data = await response.json();

      if (data.isLinked) {
        // Show warning if role is linked to users
        await Swal.fire({
          title: 'Cannot Delete Role',
          html: `This role is currently assigned to the following users:<br/><br/>${data.linkedUsers.join('<br/>')}`,
          icon: 'warning',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6',
        });
      } else {
        // Show confirmation dialog if role can be deleted
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
        //   await onDelete(roleId);
        //   Swal.fire(
        //     'Deleted!',
        //     'Role has been deleted.',
        //     'success'
        //   );
        // }
        await onDelete(roleId);
      }
    } catch (error) {
      console.error('Error checking role usage:', error);
      Swal.fire(
        'Error',
        'An error occurred while checking role usage.',
        'error'
      );
    }
  };

  const isAdmin = currentUser?.roles?.some(role => role.name === 'admin' || role.name === 'Admin');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Role Management</h2>
        {isAdmin && (
          <Button onClick={handleAddRole} disabled={isProcessing}>
            <FiPlus /> Add Role
          </Button>
        )}
      </div>

      {roles.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={roles.map(role => role._id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {roles.map((role) => (
                <SortableRole
                  key={role._id}
                  role={role}
                  onDelete={handleDeleteRole}
                  onEdit={handleEditRole}
                  currentUser={currentUser}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <EmptyState
          icon={FiShield}
          title="No roles defined"
          description="Add your first role to get started"
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          if (!isProcessing) {
            setIsModalOpen(false);
            setEditingRole(null);
          }
        }}
        title={editingRole ? 'Edit Role' : 'Add New Role'}
      >
        <EntityForm
          type="role"
          data={editingRole}
          onSubmit={handleSubmit}
          onCancel={() => {
            if (!isProcessing) {
              setIsModalOpen(false);
              setEditingRole(null);
            }
          }}
        />
      </Modal>
    </div>
  );
};

export default RoleManagement; 