import _ from 'lodash'
import log from '../../lib/logger'

const CHARS_TO_REPLACE = '[-\/\._]'

export const parseText = function({ text }) {
  const charsToReplace = new RegExp(`${CHARS_TO_REPLACE}+`, 'g')
  const parsedText = _.capitalize(text.replace(charsToReplace, ' '))

  log.debug('parsedText', text, parsedText)
  return parsedText
}

export const parseSlug = ({ what = '', urtext = '' }) => {
  const words = what.split(' ')
  const lastWord = words[words.length - 1]
  const endOfText = urtext.search(lastWord) + lastWord.length

  const slug = urtext.substr(0, endOfText)

  log.debug('parsedSlug', what, urtext, slug)
  return slug
}
