import Handlebars from 'handlebars'

const colorFromPercent = (score) => {
  let color = ''

  switch (true) {
    case (score == null):
      color = 'infinity'
      break
    case (score < 0.5):
      color = 'red'
      break
    case (score < 0.9):
      color = 'orange'
      break
    case (score < 1):
      color = 'blue'
      break
    default:
      color = 'green'
  }

  // console.log('colorFromPercent', score, color)
  return color
}

Handlebars.registerHelper('scoreColor', function(score) {
  const color = colorFromPercent(score)
  // console.log('scoreColor', credit, color)
  return `reliability--status-${color}`
})

Handlebars.registerHelper('creditColor', function(credit) {
  const color = colorFromPercent(credit)
  // console.log('creditColor', credit, color)
  return `credit--status-${color}`
})

Handlebars.registerHelper('dueColor', function(diff) {
  let color = ''

  switch (true) {
    case (diff < -(24 * 5)):
      color = 'green'
      break
    case (diff < -(24 * 2)):
      color = 'blue'
      break
    case (diff < -24):
      color = 'yellow'
      break
    case (diff < 0):
      color = 'orange'
      break
    case (diff >= 0):
      color = 'red'
      break
    default:
      color = 'gray'
  }

  // console.log('dueColor', diff, color)
  return `promise--status-${color}`
})
