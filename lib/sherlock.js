/*
 * Sherlock
 * Copyright (c) 2017 Neil Gupta
 */

import Watson from './watson'

class Sherlock {
  nowDate = null
  patterns = Watson.patterns
  config = {
    disableRanges: false
  }

  config(newConfig) {
    if (typeof newConfig === 'object') {
      this.config = newConfig
    }
    return null
  }

  // Sets what time Sherlock thinks it is right now, regardless of system time.
  // Useful for debugging different times.
  // Pass a Date object to set 'now' to a time of your choosing.
  // Don't pass in anything to reset 'now' to the real time.
  _setNow(newDate) {
    this.nowDate = newDate
  }

  getNow() {
    if (this.nowDate) {
      return new Date(this.nowDate.getTime())
    }
    return new Date()
  }

  matchTime(str, time, startTime) {
    let match, matchConfidence = 0, matchedString = false, matchedHour, matchedMin, matchedHasMeridian

    if (match = str.match(new RegExp(this.patterns.explicitTime.source, 'g'))) {
      // if multiple matches found, pick the best one
      match = match.sort(function(a, b) {
        let aScore = a.trim().length,
          bScore = b.trim().length
        // Weight matches that include full meridian
        if (a.match(/(?:a|p).?m.?/)) {aScore += 20}
        if (b.match(/(?:a|p).?m.?/)) {bScore += 20}
        return bScore - aScore
      })[0].trim()

      if (match.length <= 2 && str.trim().length > 2) {matchConfidence = 0} else {
        matchConfidence = match.length
        match = match.match(this.patterns.explicitTime)

        let hour = parseInt(match[1]),
          min = match[2] || 0,
          meridian = match[3]

        if (meridian) {
          // meridian is included, adjust hours accordingly
          if (meridian.indexOf('p') === 0 && hour != 12) {hour += 12} else if (meridian.indexOf('a') === 0 && hour == 12) {hour = 0}
          matchConfidence += 20
        } else if (hour < 12 && (hour < 7 || hour <= time.getHours()))
        // meridian is not included, adjust any ambiguous times
        // if you type 3, it will default to 3pm
        // if you type 11 at 5am, it will default to am,
        // but if you type it at 2pm, it will default to pm
        {hour += 12}

        matchedHour = hour
        matchedMin = min
        matchedHasMeridian = !!meridian
        matchedString = match[0]
      }
    }

    let useLowConfidenceMatchedTime = function() {
      if (matchedString) {
        time.setHours(matchedHour, matchedMin, 0)
        time.hasMeridian = matchedHasMeridian
      }
      return matchedString
    }

    if (matchConfidence < 4) {
      if (match = str.match(this.patterns.inRelativeTime)) {
        // if we matched 'a' or 'an', set the number to 1
        if (isNaN(match[1])) {match[1] = 1}

        if (match[3]) {match[1] = parseInt(match[1]) * -1}

        switch (match[2].substring(0, 1)) {
          case 'h':
            time.setHours(time.getHours() + parseInt(match[1]))
            return match[0]
          case 'm':
            time.setMinutes(time.getMinutes() + parseInt(match[1]))
            return match[0]
          default:
            return useLowConfidenceMatchedTime()
        }
      } else if (match = str.match(this.patterns.inMilliTime)) {
        if (match[3]) {match[1] = parseInt(match[1]) * -1}

        switch (match[2].substring(0, 1)) {
          case 's':
            time.setSeconds(time.getSeconds() + parseInt(match[1]))
            return match[0]
          case 'm':
            time.setMilliseconds(time.getMilliseconds() + parseInt(match[1]))
            return match[0]
          default:
            return useLowConfidenceMatchedTime()
        }
      } else if (match = str.match(this.patterns.midtime)) {
        switch (match[1]) {
          case 'dawn':
            time.setHours(5, 0, 0)
            time.hasMeridian = true
            return match[0]
          case 'morn':
          case 'morning':
            time.setHours(8, 0, 0)
            time.hasMeridian = true
            return match[0]
          case 'noon':
            time.setHours(12, 0, 0)
            time.hasMeridian = true
            return match[0]
          case 'afternoon':
            time.setHours(14, 0, 0)
            time.hasMeridian = true
            return match[0]
          case 'evening':
            time.setHours(19, 0, 0)
            time.hasMeridian = true
            return match[0]
          case 'night':
            time.setHours(21, 0, 0)
            time.hasMeridian = true
            return match[0]
          case 'midnight':
            time.setHours(0, 0, 0)
            time.hasMeridian = true
            return match[0]
          default:
            return useLowConfidenceMatchedTime()
        }
      } else if (match = str.match(this.patterns.internationalTime)) {
        time.setHours(match[1], match[2], 0)
        time.hasMeridian = true
        return match[0]
      } else {return useLowConfidenceMatchedTime()}
    } else {return useLowConfidenceMatchedTime()}
  }

  matchDate(str, time, startTime) {
    let match
    if (match = str.match(this.patterns.monthDay)) {
      if (match[3]) {
        time.setFullYear(match[3], Watson.changeMonth(match[1]), match[2])
        time.hasYear = true
      } else {time.setMonth(Watson.changeMonth(match[1]), match[2])}
      return match[0]
    } else if (match = str.match(this.patterns.dayMonth)) {
      if (match[3]) {
        time.setFullYear(match[3], Watson.changeMonth(match[2]), match[1])
        time.hasYear = true
      } else {time.setMonth(Watson.changeMonth(match[2]), match[1])}
      return match[0]
    } else if (match = str.match(this.patterns.shortForm)) {
      let yearStr = match[3], year = null
      if (yearStr) {year = parseInt(yearStr)}
      if (year && yearStr.length < 4)
      // if only 2 digits are given, assume years above 50 are in the 20th century, otherwise 21st century
      {year += year > 50 ? 1900 : 2000}
      if (year) {
        time.setFullYear(year, match[1] - 1, match[2])
        time.hasYear = true
      } else {time.setMonth(match[1] - 1, match[2])}
      return match[0]
    } else if (match = str.match(this.patterns.oxtDays) || str.match(this.patterns.oxtDaysUK)) {
      switch (match[1].substr(0, 3)) {
        case 'sun':
          Watson.changeDay(time, 0, 'oxt')
          return match[0]
        case 'mon':
          Watson.changeDay(time, 1, 'oxt')
          return match[0]
        case 'tue':
          Watson.changeDay(time, 2, 'oxt')
          return match[0]
        case 'wed':
          Watson.changeDay(time, 3, 'oxt')
          return match[0]
        case 'thu':
          Watson.changeDay(time, 4, 'oxt')
          return match[0]
        case 'fri':
          Watson.changeDay(time, 5, 'oxt')
          return match[0]
        case 'sat':
          Watson.changeDay(time, 6, 'oxt')
          return match[0]
        default:
          return false
      }
    } else if (match = str.match(this.patterns.weekdays)) {
      switch (match[2].substr(0, 3)) {
        case 'sun':
          Watson.changeDay(time, 0, match[1])
          return match[0]
        case 'mon':
          Watson.changeDay(time, 1, match[1])
          return match[0]
        case 'tue':
          Watson.changeDay(time, 2, match[1])
          return match[0]
        case 'wed':
          Watson.changeDay(time, 3, match[1])
          return match[0]
        case 'thu':
          Watson.changeDay(time, 4, match[1])
          return match[0]
        case 'fri':
          Watson.changeDay(time, 5, match[1])
          return match[0]
        case 'sat':
          Watson.changeDay(time, 6, match[1])
          return match[0]
        default:
          return false
      }
    } else if (match = str.match(this.patterns.inRelativeDateFromRelativeDate)) {
      if (Watson.relativeDateMatcher(match[4], time, this.getNow()) && Watson.inRelativeDateMatcher(match[1], match[2], match[3], time)) {return match[0]}
      return false
    } else if (match = str.match(this.patterns.relativeDate)) {
      if (Watson.relativeDateMatcher(match[1], time, this.getNow())) {return match[0]}
      return false
    } else if (match = str.match(this.patterns.inRelativeDate)) {
      if (Watson.inRelativeDateMatcher(match[1], match[2], match[3], time)) {return match[0]}
      return false
    } else if (match = str.match(new RegExp(this.patterns.days, 'g'))) {
      // if multiple matches found, pick the best one
      match = match.sort(function(a, b) { return b.trim().length - a.trim().length })[0].trim()
      // check if the possible date match meets our reasonable assumptions...
      // if the match doesn't start with 'on',
      if ((match.indexOf('on') !== 0 &&
        // and if the match doesn't start with 'the' and end with a comma,
        !(match.indexOf('the') === 0 && match.indexOf(',', match.length - 1) !== -1) &&
        // and if the match isn't at the end of the overall input, then drop it.
        str.indexOf(match, str.length - match.length - 1) === -1) ||
      // But if one of those is true, make sure it passes these other checks too...
        // if this is an end date and the start date isn't an all day value,
        (!(startTime && startTime.isAllDay) &&
        // and if this match is too short to mean something,
        match.length <= 2))
      // then drop it.
      {return false}
      match = match.match(this.patterns.daysOnly)

      let month = time.getMonth(),
        day = match[1]

      // if this date is in the past, move it to next month
      if (day < time.getDate()) {month++}

      time.setMonth(month, day)
      return match[0]
    } else {return false}
  }

  // Make some intelligent assumptions of what was meant, even when given incomplete information
  makeAdjustments(start, end, isAllDay, str, ret, now = new Date()) {
    if (end) {
      if (start > end && end > now && Watson.isSameDay(start, end) && Watson.isSameDay(start, now)) {
        if (start.hasMeridian)
        // we explicitly set the meridian, so don't mess with the hours
        {start.setDate(start.getDate() - 1)} else {
          // we are dealing with a time range that is today with start > end
          // (ie. 9pm - 5pm when we want 9am - 5pm), roll back 12 hours.
          start.setHours(start.getHours() - 12)
          // if start is still higher than end, that means we probably have
          // 9am - 5am, so roll back another 12 hours to get 9pm yesterday - 5am today
          if (start > end) {start.setHours(start.getHours() - 12)}
        }
      } else if (start > end) {
        end.setDate(start.getDate() + 1)
      } else if (end < now && str.indexOf(' was ') === -1 && Watson.monthDiff(end, now) >= 3 && !end.hasYear && !start.hasYear) {
        end.setFullYear(end.getFullYear() + 1)
        start.setFullYear(start.getFullYear() + 1)
      }
    } else if (start) {
      if (start <= now && !start.hasYear && !str.match(/was|ago|old\b/)) {
        if (Watson.isSameDay(start, now) && !isAllDay) {
          if (start.hasMeridian || start.getHours() < 19)
          // either we explicitly set the meridian or the time
          // is less than 7pm, so don't mess with the hours
          {start.setDate(start.getDate() + 1)} else {
            start.setHours(start.getHours() + 12)
            // if start is still older than now, roll forward a day instead
            if (start <= now) {
              start.setHours(start.getHours() - 12)
              start.setDate(start.getDate() + 1)
            }
          }
        } else if (Watson.monthDiff(start, now) >= 3) {start.setFullYear(start.getFullYear() + 1)}
      }

      // check for open ranges (more than...)
      if (ret.eventTitle.match(this.patterns.more_than_comparator)) {
        if ((start <= now && (!Watson.isSameDay(start, now) || str.match(/ago|old\b/)) &&
            !ret.eventTitle.match(/after|newer/i)) ||
            ret.eventTitle.match(/older|before/i)) {
          ret.endDate = new Date(start.getTime())
          ret.startDate = new Date(1900, 0, 1, 0, 0, 0, 0)
        } else {
          ret.endDate = new Date(3000, 0, 1, 0, 0, 0, 0)
        }
        ret.eventTitle = ret.eventTitle.replace(this.patterns.more_than_comparator, '')
      }
      // check for closed ranges (less than...)
      else if (ret.eventTitle.match(this.patterns.less_than_comparator)) {
        if (start <= now) {
          if (Watson.isSameDay(start, now) && !str.match(/ago|old\b/)) {
            // make an exception for "less than today" or "less than now"
            ret.endDate = new Date(start.getTime())
            ret.startDate = new Date(1900, 0, 1, 0, 0, 0, 0)
          } else {ret.endDate = new Date(now.getTime())}
        } else {
          ret.endDate = new Date(start.getTime())
          ret.startDate = new Date(now.getTime())
        }
        ret.eventTitle = ret.eventTitle.replace(this.patterns.less_than_comparator, '')
      }
    }
  }

  parser(str, time, startTime) {
    let ret = {},
      dateMatch = false,
      timeMatch = false,
      strNummed = Watson.strToNum(str)

    // parse date
    if (dateMatch = this.matchDate(strNummed, time, startTime)) {
      strNummed = strNummed.replace(new RegExp(dateMatch), '')
      str = str.replace(new RegExp(Watson.numToStr(dateMatch)), '')
    }

    // parse time
    if (timeMatch = this.matchTime(strNummed, time, startTime)) {str = str.replace(new RegExp(Watson.numToStr(timeMatch)), '')}

    ret.eventTitle = str

    // if time data not given, then this is an all day event
    ret.isAllDay = !!(dateMatch && !timeMatch && !dateMatch.match(/^(?:right )?now$|^tonight$/))

    // check if date was parsed
    ret.isValidDate = !!(dateMatch || timeMatch)

    return ret
  }

  // parses a string and returns an object defining the basic event
  // with properties: eventTitle, startDate, endDate, isAllDay
  // plus anything Watson adds on...
  parse(input, opts = {}) {
    // check for null input
    if (input === null) input = ''

    const date = this.getNow();

    // Check if Watson is around. If not, pretend like he is to keep Sherlock company.
    let result // = (typeof Watson !== 'undefined') ? Watson.preprocess(str) : [str, {}],
    const str = input // result[0]
    const ret = {} // result[1]
    // token the string to start and stop times
    const tokens = opts.disableRanges ? [str.toLowerCase()] : str.toLowerCase().split(this.patterns.rangeSplitters)

    this.patterns.rangeSplitters.lastIndex = 0

    // normalize all dates to 0 milliseconds
    date.setMilliseconds(0)

    while (!ret.startDate) {
      // parse the start date
      if ((result = this.parser(tokens[0], date, null)) !== null) {
        if (result.isAllDay)
        // set to midnight
        {date.setHours(0, 0, 0)}

        ret.isAllDay = result.isAllDay
        ret.eventTitle = result.eventTitle
        ret.startDate = result.isValidDate ? date : null
      }

      // if no time
      if (!ret.startDate && tokens.length >= 3) {
        // join the next 2 tokens to the current one
        var tokensTmp = [tokens[0] + tokens[1] + tokens[2]]
        for (var k = 3; k < tokens.length; k++) {
          tokensTmp.push(tokens[k])
        }
        tokens = tokensTmp
      } else {break}
    }

    // parse the 2nd half of the date range, if it exists
    while (!ret.endDate) {
      if (tokens.length > 1) {
        date = new Date(date.getTime())
        // parse the end date
        if ((result = this.parser(tokens[2], date, ret)) !== null) {
          if (ret.isAllDay)
          // set to midnight
          {date.setHours(0, 0, 0)}

          if (result.eventTitle.length > ret.eventTitle.length) {ret.eventTitle = result.eventTitle}

          ret.endDate = result.isValidDate ? date : null
        }
      }

      if (!ret.endDate) {
        if (tokens.length >= 4) {
          // join the next 2 tokens to the current one
          var tokensTmp = [tokens[0], tokens[1], tokens[2] + tokens[3] + tokens[4]]
          for (var k = 5; k < tokens.length; k++) {
            tokensTmp.push(tokens[k])
          }
          tokens = tokensTmp
        } else {
          ret.endDate = null
          break
        }
      }
    }

    this.makeAdjustments(ret.startDate, ret.endDate, ret.isAllDay, str, ret)

    // get capitalized version of title
    if (ret.eventTitle) {
      let fillerWords = opts.disableRanges ? this.patterns.fillerWords2 : this.patterns.fillerWords
      ret.eventTitle = ret.eventTitle.split(fillerWords)[0].trim()
      ret.eventTitle = ret.eventTitle.replace(/(?:^| )(?:\.|-$|by$|in$|at$|from$|on$|starts?$|for$|(?:un)?till?$|!|,|;)+/g, '').replace(/ +/g, ' ')
        .trim()
      let match = str.match(new RegExp(Watson.escapeRegExp(ret.eventTitle), 'i'))
      if (match) {
        ret.eventTitle = match[0].replace(/ +/g, ' ').trim() // replace multiple spaces
        if (ret.eventTitle == '') {ret.eventTitle = null}
      }
    } else {ret.eventTitle = null}

    // if (typeof Watson !== 'undefined') {Watson.postprocess(ret)}

    return ret
  }
}

export default new Sherlock()
