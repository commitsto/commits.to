var swal = swal || {};

var completePromiseText = {
  title: 'Mark this promise completed?',
  text: "You won't be able to revert this!",
  type: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, complete it!',
  cancelButtonText: 'No, cancel!'
}

// var deletePromise = {
//   title: 'Delete this?',
//   text: "You won't be able to revert this!",
//   type: 'warning',
//   showCancelButton: true,
//   confirmButtonColor: '#3085d6',
//   cancelButtonColor: '#d33',
//   confirmButtonText: 'Yes, complete it!',
//   cancelButtonText: 'No, cancel!'
// }

function completePromise(id) {
  console.log('completePromise', id);
  
  swal(completePromiseText).then(function () {
    fetch(`/promises/complete/${id}`).then(function(response) {
      if(response.ok) {
        return swal(
          'Completed!',
          'Your promise has been fulfilled.',
          'success'
        )
      }
      throw new Error('Network response was not ok.')
    })
  }, function (dismiss) {
    // dismiss can be 'cancel', 'overlay',
    // 'close', and 'timer'
    if (dismiss === 'cancel') {

    }
  })
}

function editPromise(id) {
  
}