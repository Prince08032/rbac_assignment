'use client';
import { FiLogOut } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { showSuccessAlert, showErrorAlert, showConfirmDialog } from '@/utils/alerts';

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const result = await showConfirmDialog(
        'Logout Confirmation',
        'Are you sure you want to logout?'
      );

      if (result.isConfirmed) {
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
        });

        if (response.ok) {
          await showSuccessAlert('Logged out successfully');
          window.location.reload();
        } else {
          showErrorAlert('Logout failed');
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
      showErrorAlert('Logout failed. Please try again.');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 w-full p-2 text-red-400 hover:bg-gray-700 rounded transition-colors"
    >
      <FiLogOut className="h-5 w-5" />
      <span>Logout</span>
    </button>
  );
};

export default LogoutButton; 