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

var apiPath = function(action, username, id) {
  // var subdomainTest = new RegExp(/^([a-z]+\:\/{2})?([\w-]+\.[\w-]+\.\w+)$/)
  var host = window.location.hostname.split('.')

  var hasSubdomain = host[2] && host[0] != 'www';

  var prefix = !hasSubdomain ? `/_s/${username}` : ''

  console.log('apiPath', host, hasSubdomain, prefix)
  return `${prefix}/promises/${action}/${id}`
}

var completePromise = function(username, id) {
  console.log('completePromise', id, username)
  var apiUrl = apiPath('complete', username, id)

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

var deletePromise = function(username, id) {
  console.log('deletePromise', id, username)

  var apiUrl = apiPath('remove', username, id)

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
