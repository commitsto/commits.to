import Swal from 'sweetalert2';

const DeleteModal = () => Swal.fire({
  cancelButtonText: 'No, cancel!',
  confirmButtonText: 'Yes, delete it!',
  reverseButtons: true,
  showCancelButton: true,
  text: "You won't be able to revert this!",
  title: 'Are you sure?',
  type: 'warning',
});

export default DeleteModal;
