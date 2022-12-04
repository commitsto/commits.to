import colorList from 'lib/theme/colors'

const colorFromPercent = (score) => {
  let color = 'green' // default

  switch (true) {
    case (score == null):
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
  }
  // console.log('colorFromPercent', score, color);
  return color
}

export const scoreColor = (score) => {
  const color = colorFromPercent(score)
  // console.log('scoreColor', score, color);
  return colorList[color]
}

export const creditColor = (credit) => {
  const color = colorFromPercent(credit)
  // console.log('creditColor', credit, color);
  return colorList[color]
}

export const dueColor = (diff) => {
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
  // console.log('dueColor', diff, color);
  return colorList[color]
}
