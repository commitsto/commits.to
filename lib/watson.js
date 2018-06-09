if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g,'');
  };
}

class Watson {
  /* eslint-disable max-len */
  static patterns = {
    rangeSplitters: /(\bto\b|\-|\b(?:un)?till?\b|\bthrough\b|\bthru\b|\band\b|\bends?\b)/g,

    // oct, october
    months: '\\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\\b',
    // 3, 31, 31st, fifth
    days: '\\b(?:(?:(?:on )?the )(?=\\d\\d?(?:st|nd|rd|th)))?([1-2]\\d|3[0-1]|0?[1-9])(?:st|nd|rd|th)?(?:,|\\b)',
    // 2014, 1990
    // Does not recognize 1930 for example because that could be confused with a valid time.
    // Exceptions are made for years in 21st century.
    years: '\\b(20\\d{2}|\\d{2}[6-9]\\d)\\b',

    // 5/12/2014
    shortForm: /\b(0?[1-9]|1[0-2])\/([1-2]\d|3[0-1]|0?[1-9])\/?(\d{2,4})?\b/,

    // tue, tues, tuesday
    weekdaysStr: '\\b(sun|mon|tue(?:s)?|wed(?:nes)?|thu(?:rs?)?|fri|sat(?:ur)?)(?:day)?\\b',
    relativeDateStr: '((?:next|last|this) (?:week|month|year)|tom(?:orrow)?|tmrw|tod(?:ay)?|(?:right )?now|tonight|day after (?:tom(?:orrow)?|tmrw)|yest(?:erday)?|day before yest(?:erday)?)',
    inRelativeDateStr: '(\\d{1,4}|a) (day|week|month|year)s? ?(ago|old)?',

    inRelativeTime: /\b(\d{1,2} ?|a |an )(h(?:our)?|m(?:in(?:ute)?)?)s? ?(ago|old)?\b/,
    inMilliTime: /\b(\d+) ?(s(?:ec(?:ond)?)?|ms|millisecond)s? ?(ago|old)?\b/,
    midtime: /(?:@ ?)?\b(?:at )?(dawn|morn(?:ing)?|noon|afternoon|evening|night|midnight)\b/,
    // 23:50, 0700, 1900
    internationalTime: /\b(?:(0[0-9]|1[3-9]|2[0-3]):?([0-5]\d))\b/,
    // 5, 12pm, 5:00, 5:00pm, at 5pm, @3a
    explicitTime: /(?:@ ?)?\b(?:at |from )?(1[0-2]|[1-2]?[1-9])(?::?([0-5]\d))? ?([ap]\.?m?\.?)?(?:o'clock)?\b/,

    more_than_comparator: /((?:more|greater|older|newer) than|after|before)/i,
    less_than_comparator: /((?:less|fewer) than)/i,

    // filler words must be preceded with a space to count
    fillerWords: / (from|is|was|at|on|for|in|due(?! date)|(?:un)?till?)\b/,
    // less aggressive filler words regex to use when rangeSplitters are disabled
    fillerWords2: / (was|is|due(?! date))\b/,
    /* eslint-enable max-len */

    // may 5, may 5th
    get monthDay() {
      const { months, days, years } = this
      return RegExp(`${months} ${days}(?: ${years})?`)
    },
    // 5th may, 5 may
    get dayMonth() {
      const { months, days, years } = this
      return RegExp(`${days}(?: (?:day )?of)? ${months}(?: ${years})?`)
    },
    // 5, 5th
    get daysOnly() {
      const { days } = this
      return RegExp(days)
    },
    get digit() {
      return RegExp('\\b(' + Watson.intToWords.join('|') + ')\\b', 'g')
    },
    // today, tomorrow, day after tomorrow
    get relativeDate() {
      const { relativeDateStr } = this
      return RegExp(`\\b${relativeDateStr}\\b`)
    },
    // in 2 weeks
    get inRelativeDate() {
      const { inRelativeDateStr } = this
      return RegExp(`\\b${inRelativeDateStr}\\b`)
    },
    // 2 weeks from tomorrow
    get inRelativeDateFromRelativeDate() {
      const { inRelativeDateStr, relativeDateStr } = this
      return RegExp(`\\b${inRelativeDateStr} from ${relativeDateStr}\\b`)
    },
    // next Friday, thu
    get weekdays() {
      const { weekdaysStr } = this
      return RegExp(`(?:(next|last) (?:week (?:on )?)?)?${weekdaysStr}`)
    },
    // oxt monday
    get oxtDays() {
      const { weekdaysStr } = this
      return RegExp(`(?:\\boxt|\\bweek next)${weekdaysStr}`)
    },
    // thursday week
    get oxtDaysUK() {
      const { weekdaysStr } = this
      return RegExp(`${weekdaysStr} week\\b`)
    },
  }

  static relativeDateMatcher = function(match, time, now = new Date()) {
    switch (match) {
      case 'next week':
        time.setFullYear(now.getFullYear(), now.getMonth(), now.getDate() + 7)
        time.hasYear = true
        return true
      case 'next month':
        time.setFullYear(now.getFullYear(), now.getMonth() + 1, now.getDate())
        time.hasYear = true
        return true
      case 'next year':
        time.setFullYear(now.getFullYear() + 1, now.getMonth(), now.getDate())
        time.hasYear = true
        return true
      case 'last week':
        time.setFullYear(now.getFullYear(), now.getMonth(), now.getDate() - 7)
        time.hasYear = true
        return true
      case 'last month':
        time.setFullYear(now.getFullYear(), now.getMonth() - 1, now.getDate())
        time.hasYear = true
        return true
      case 'last year':
        time.setFullYear(now.getFullYear() - 1, now.getMonth(), now.getDate())
        time.hasYear = true
        return true
      case 'tom':
      case 'tmrw':
      case 'tomorrow':
        time.setFullYear(now.getFullYear(), now.getMonth(), now.getDate() + 1)
        time.hasYear = true
        return true
      case 'day after tom':
      case 'day after tmrw':
      case 'day after tomorrow':
        time.setFullYear(now.getFullYear(), now.getMonth(), now.getDate() + 2)
        time.hasYear = true
        return true
      case 'this week':
      case 'this month': // this week|month|year is pretty meaningless
      case 'this year': // but let's include it so that it parses as today
      case 'tod':
      case 'today':
        time.setFullYear(now.getFullYear(), now.getMonth(), now.getDate())
        time.hasYear = true
        return true
      case 'now':
      case 'right now':
      case 'tonight':
        time.setFullYear(now.getFullYear(), now.getMonth(), now.getDate())
        time.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), 0)
        if (match === 'tonight' && time.getHours() < 21) {
          time.setHours(21, 0, 0, 0) // Assume "tonight" starts at 9pm
        }
        time.hasMeridian = true
        time.hasYear = true
        return true
      case 'yest':
      case 'yesterday':
        time.setFullYear(now.getFullYear(), now.getMonth(), now.getDate() - 1)
        time.hasYear = true
        return true
      case 'day before yest':
      case 'day before yesterday':
        time.setFullYear(now.getFullYear(), now.getMonth(), now.getDate() - 2)
        time.hasYear = true
        return true
      default:
        return false
    }
  }

  static inRelativeDateMatcher = function(num, scale, ago, time) {
    // if we matched 'a' or 'an', set the number to 1
    if (isNaN(num)) {num = 1} else {num = parseInt(num, 10)}

    if (ago) {num = num * -1}

    switch (scale) {
      case 'day':
        time.setDate(time.getDate() + num)
        time.hasYear = true
        return true
      case 'week':
        time.setDate(time.getDate() + num * 7)
        time.hasYear = true
        return true
      case 'month':
        time.setMonth(time.getMonth() + num)
        time.hasYear = true
        return true
      case 'year':
        time.setFullYear(time.getFullYear() + num)
        time.hasYear = true
        return true
      default:
        return false
    }
  }

  // convert month string to number
  static changeMonth = function(month) {
    return this.monthToInt[month.substr(0, 3)]
  }

  // find the nearest future date that is on the given weekday
  static changeDay = function(time, newDay, hasNext) {
    let diff = 7 - time.getDay() + newDay
    // If entering "last saturday" on a Saturday, for example,
    // diff will be 0 when it should be -7
    if ((diff > 7 && hasNext === undefined) || hasNext === 'last') { diff -= 7 }
    if (diff >= 0 && hasNext === 'last') { diff -= 7 }
    if (hasNext === 'oxt') {diff += 7}

    time.setDate(time.getDate() + diff)
  }

  static monthDiff = function(d1, d2) {
    let months
    months = (d2.getFullYear() - d1.getFullYear()) * 12
    months -= d1.getMonth() + 1
    months += d2.getMonth() + 1
    return months <= 0 ? 0 : months
  }

  static escapeRegExp = function(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
  }

  static isSameDay = function(date1, date2) {
    return date1.getMonth() === date2.getMonth()
      && date1.getDate() === date2.getDate()
      && date1.getFullYear() === date2.getFullYear()
  }

  static monthToInt = {
    'jan': 0,
    'feb': 1,
    'mar': 2,
    'apr': 3,
    'may': 4,
    'jun': 5,
    'jul': 6,
    'aug': 7,
    'sep': 8,
    'oct': 9,
    'nov': 10,
    'dec': 11,
  }

  // mapping of words to numbers
  static wordsToInt = {
    'one': 1,
    'first': 1,
    'two': 2,
    'second': 2,
    'three': 3,
    'third': 3,
    'four': 4,
    'fourth': 4,
    'five': 5,
    'fifth': 5,
    'six': 6,
    'sixth': 6,
    'seven': 7,
    'seventh': 7,
    'eight': 8,
    'eighth': 8,
    'nine': 9,
    'ninth': 9,
    'ten': 10,
    'tenth': 10
  }

  // mapping of number to words
  static intToWords = [
    'one|first',
    'two|second',
    'three|third',
    'four|fourth',
    'five|fifth',
    'six|sixth',
    'seven|seventh',
    'eight|eighth',
    'nine|ninth',
    'ten|tenth'
  ]

  // converts all the words in a string into numbers, such as four -> 4
  static strToNum = function(str) {
    return str.replace(Watson.patterns.digit, function(val) {
      let out = Watson.wordsToInt[val]
      if (val.indexOf('th', val.length - 2) !== -1) {
        out += 'th'
      } else if (val.indexOf('st', val.length - 2) !== -1) {
        out += 'st'
      } else if (val.indexOf('nd', val.length - 2) !== -1) {
        out += 'nd'
      } else if (val.indexOf('rd', val.length - 2) !== -1) {
        out += 'rd'
      }
      return out
    })
  }

  // converts all the numbers in a string into regex
  // for number|word, such as 4 -> 4|four
  static numToStr = function(str) {
    return str.replace(/((?:[1-9]|10)(?:st|nd|rd|th)?)/g, function(val) {
      return '(?:' + val + '|' + Watson.intToWords[parseInt(val, 10) - 1] + ')'
    })
  }
}

export default Watson
