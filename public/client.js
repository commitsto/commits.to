// --------------------------------- 80chars ---------------------------------->
// FIXME left over from testing
$(function() {
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