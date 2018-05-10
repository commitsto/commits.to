import moment from 'moment-timezone'
import timezones from '../data/timezones.json'

moment.tz.add(timezones.zones)
