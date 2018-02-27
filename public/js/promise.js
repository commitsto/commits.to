const swal = window.swal || {}

const completePromiseText = {
  title: 'Mark this promise completed?',
  text: 'You can always edit this later.',
  type: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, complete it!',
  cancelButtonText: 'No, cancel!'
}

const deletePromiseText = {
  title: 'Delete this promise?',
  text: 'You won\'t be able to revert this!',
  type: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, delete it!',
  cancelButtonText: 'No, cancel!',
  useRejections: true,
}

const parseHost = function() {
  const host = window.location.hostname.split('.')
  const hasSubdomain = host[2] && host[0] !== 'www'
  console.log('parseHost', host, hasSubdomain)
  return hasSubdomain
}

const promisePath = function(username, id) {
  const hasSubdomain = parseHost()
  let path = '/'

  const urtext = id.slice(username.length + 1) // FIXME: when this is transpiled

  if (hasSubdomain) {
    path += urtext
  } else {
    path += `/${username}.${window.location.host}/${urtext}`
  }

  console.log('promisePath', path)
  return path
}

const apiPath = function(action, username, id) {
  const hasSubdomain = parseHost()
  const prefix = !hasSubdomain ? `/_s/${username}` : ''
  return `${prefix}/promises/${action}/${id}`
}

const completePromise = function(username, id) {
  console.log('completePromise', id, username)
  const apiUrl = apiPath('complete', username, id)

  swal(completePromiseText).then(function() {
    fetch(apiUrl).then(function(response) {
      if (response.ok) {
        return swal(
          'Completed!',
          'Your promise has been fulfilled.',
          'success'
        ).then(function(result) {
          if (result) {
            if (parseHost()) {
              window.location.reload()
            } else {
              window.location.href = promisePath(username, id)
            }

          }
        })
      }
      throw new Error('Network response was not ok.')
    })
  })
}

const deletePromise = function(username, id) {
  console.log('deletePromise', id, username)

  let apiUrl = apiPath('remove', username, id)

  swal(deletePromiseText).then(function() {
    fetch(apiUrl).then(function(response) {
      if (response.ok) {
        swal(
          'Deleted!',
          'Your promise has been deleted.',
          'success',
        ).then(function() {
          window.location.href = '/' // redirect to subdomain root
        })
      }
      throw new Error('Network response was not ok.')
    })
  })
}
