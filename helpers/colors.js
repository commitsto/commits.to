import moment from 'moment-timezone'
import Handlebars from 'handlebars'

Handlebars.registerHelper('creditColor', function(credit) {
  let color = undefined;
  
  switch (true) {
    case (credit < .5):
      color = 'red'
      break
    case (credit < .9):
      color = 'orange'
      break
    case (credit < 1):
      color = 'blue'
      break
    case (credit != undefined):
      color = 'green'
  }
  
  // console.log('creditColor', credit, color)
  return `credit--status-${color}`
});

Handlebars.registerHelper('dueColor', function(diff) {
  let color = 'green'
  
  switch (true) {
    case (diff < 0):
      color = 'gray'
      break  
    case(diff < 24):
      color = 'red'
      break
    case(diff < (24 * 2)):
      color = 'orange'
      break
    case(diff < (24 * 5)):
      color = 'blue'
  }
  
  // console.log('dueColor', diff, color)
  return `promise--status-${color}`
});
