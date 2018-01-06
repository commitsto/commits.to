var swal = swal || {}

var completePromiseText = {
  title: 'Mark this promise completed?',
  text: 'You can always edit this later.',
  type: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, complete it!',
  cancelButtonText: 'No, cancel!'
}

var deletePromiseText = {
  title: 'Delete this promise?',
  text: 'You won\'t be able to revert this!',
  type: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, delete it!',
  cancelButtonText: 'No, cancel!'
}

var completePromise = function(username, slug) {
  console.log('completePromise', slug, username)
  var subdomainTest = new RegExp(/^([a-z]+\:\/{2})?([\w-]+\.[\w-]+\.\w+)$/)
  var isSubdomain = !!('window.location.hostname').match(subdomainTest)

  var apiUrl = `${ isSubdomain ? '' : `/_s/${username}` }/promises/complete/${slug}`

  swal(completePromiseText).then(function() {
    fetch(apiUrl).then(function(response) {
      if (response.ok) {
        return swal(
          'Completed!',
          'Your promise has been fulfilled.',
          'success'
        )
      }
      throw new Error('Network response was not ok.')
    })
  }, function(dismiss) {
    // dismiss can be 'cancel', 'overlay',
    // 'close', and 'timer'
    // if (dismiss === 'cancel') {}
  })
}

var editPromise = function(id) {
  fetch('/promises/edit/${id}')
}

var deletePromise = function(username, slug) {
  console.log('deletePromise', slug, username)

  var apiUrl = `/promises/remove/${slug}`

  swal(deletePromiseText).then(function() {
    fetch(apiUrl).then(function(response) {
      if (response.ok) {
        return swal(
          'Deleted!',
          'Your promise has been deleted.',
          'success'
        )
      }
      throw new Error('Network response was not ok.')
    })
  }, function(dismiss) {
    if (dismiss === 'close') {
      window.location.pathname = '/'
    }
  })
}
