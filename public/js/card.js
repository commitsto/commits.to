$(document).ready(function() {
  $('.momentable').each(function() {
    const $container = $(this)
    const date = $container.attr('data-date')
    const time = moment(date)
    $(this).children('span').text(time.format('MMMM Do YYYY, h:mm:ss a'))
    $container.addClass('momentable--visible')
  })
})
