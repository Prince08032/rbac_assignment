import Swal from 'sweetalert2';

export const showSuccessAlert = (message) => {
  return Swal.fire({
    title: 'Success!',
    text: message,
    icon: 'success',
    confirmButtonColor: '#3B82F6',
  });
};

export const showErrorAlert = (message) => {
  return Swal.fire({
    title: 'Error!',
    text: message,
    icon: 'error',
    confirmButtonColor: '#3B82F6',
  });
};

export const showConfirmDialog = (title, text) => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3B82F6',
    cancelButtonColor: '#EF4444',
    confirmButtonText: 'Yes',
    cancelButtonText: 'Cancel'
  });
}; 