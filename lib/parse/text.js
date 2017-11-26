export default function parseText(text) {
  // TODO: (maybe) Escaping characters?
  var dash_regex = new RegExp('-', 'g')
  var underscore_regex = new RegExp('_', 'g')
  
  try {
    var dashes = text.match(dash_regex).length
  } catch (e) {
    var dashes = 0
  }
  try {
    var underscores = text.match(underscore_regex).length
  } catch (e) {
    var underscores = 0
  }

  if (dashes > underscores) {
    var separator = dash_regex
  } else if (underscores > dashes) {
    var separator = underscore_regex
  } else {
    return text
  }

  return text.replace(separator, ' ')
}