// needs handlebars!

$(function() {
  $.get('/promises', function(users) {
    //console.log('users', users)
    let $list = $('<ul/>', {class: 'users'})
    
    for (var user in users) {
      console.log('keys', users[user]);
      let $item = $('<li/>');
      let $nest = $('<ul/>', {class: 'promises'});
      
      users[user].forEach(function(promise) {
        // moment(promise.tdue).calendar() // if tdue were unixtime
        $nest.append(
          `<li><a>${promise.what} by ${promise.tdue}</a></li>`)
      });
      
      $list.append($item.append(`<a>${user}</a>`).append($nest));
    };
    $list.appendTo('#promises-section');
  });

  $('form').submit(function(event) {
    event.preventDefault();
    var p = $('input#p').val();
    $.post('/promises?' + $.param({promise:p}), function() {
      $('<li></li>').text(p).appendTo('ul#plist');
      $('input#p').val('');
      $('input').focus();
    });
  });
})