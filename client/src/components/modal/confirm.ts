import Alert from 'sweetalert2'

const ConfirmModal = async (confirmButtonText, type) => await Alert.fire({
  cancelButtonText: 'Cancel',
  confirmButtonText,
  reverseButtons: true,
  showCancelButton: true,
  text: "You won't be able to revert this!",
  title: 'Are you sure?',
  type
})

export default ConfirmModal
