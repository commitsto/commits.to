var swal = swal || {};

var alert = {
  title: 'Are you sure?',
  text: "You won't be able to revert this!",
  type: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, delete it!',
  cancelButtonText: 'No, cancel!',
  confirmButtonClass: 'btn btn-success',
  cancelButtonClass: 'btn btn-danger'
};

function completePromise(id) {
  console.log('completePromise', id);
  
  swal(alert).then(function () {
    swal(
      'Deleted!',
      'Your file has been deleted.',
      'success'
    )
  }, function (dismiss) {
    // dismiss can be 'cancel', 'overlay',
    // 'close', and 'timer'
    if (dismiss === 'cancel') {

    }
  });
};
