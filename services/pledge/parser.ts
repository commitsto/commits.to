import _ from 'lodash';
import moment from 'moment';

// import log from 'lib/logger';
import parseCredit from 'lib/parse/credit';
import { dateOr, parseSherlock } from 'lib/parse/time';

interface IPledgeParse {
  pledge?: IPledge;
  id: IPledge['id'];
  username: IPledge['username'];
  urtext: IPledge['urtext'];
  timezone?: IPledge['timezone'];
}

class PledgeParser {
  public static matcher = new RegExp('^\/+|\/+$', 'g');

  public static generateUrtext = (urtextRaw) => urtextRaw?.replace(PledgeParser.matcher, '');

  public static generateId = ({ username, urtext }) => `${username}/${urtext}`.toLowerCase();

  public static parseId = (id) => ({ username: id?.split('/')[0], urtext: id?.split('/')[1] });

  public static generateText = (text) => {
    const CHARS_TO_REPLACE = '[-\/\._]';

    const charsToReplace = new RegExp(`${CHARS_TO_REPLACE}+`, 'g');
    const parsedText = _.upperFirst(text?.replace(charsToReplace, ' '));

    // log.debug('parsedText', text, parsedText);

    return parsedText;
  }

  public static generateSlug = ({ what = '', urtext = '' }) => {
    const words = what.split(' ');
    const lastWord = words[words.length - 1];
    const endOfText = urtext.search(lastWord) + lastWord.length;

    const slug = urtext.substr(0, endOfText);

    // log.debug('parsedSlug', what, urtext, slug);

    return slug;
  }

  public static parse = ({
    pledge = {},
    id: originalId,
    username: originalUsername,
    urtext: originalUrtext,
    timezone = 'etc/UTC',
  }: IPledgeParse) => {
    // log.debug('Pledge.parse() start', { originalId, originalUsername, originalUrtext });

    let id;
    let username;
    let urtext;

    if (originalId) {
      const { username: parsedUsername, urtext: parsedUrtext } = PledgeParser.parseId(originalId);
      urtext = PledgeParser.generateUrtext(parsedUrtext);
      username = parsedUsername;
      id = originalId;
    } else if (originalUrtext && originalUsername) {
      urtext = PledgeParser.generateUrtext(originalUrtext);
      username = originalUsername;
      id = PledgeParser.generateId({ urtext, username });
    } else {
      return undefined;
    }

    if (!urtext) {
      return undefined;
    }

    const text = PledgeParser.generateText(urtext);
    const { eventTitle, isAllDay, startDate } = parseSherlock({ text, timezone });

    const { tini, tdue: dueDate, tfin } = pledge;

    const tdue = dueDate || (startDate && moment(startDate)
      .add(+isAllDay, 'days') // turn boolean into 1 or 0
      .subtract(+isAllDay, 'seconds')
      .tz(timezone, true));

    const parsedPlege = {
      ...pledge,
      cred: parseCredit({ dueDate: tdue, finishDate: tfin }),
      id,
      slug: PledgeParser.generateSlug({ what: startDate ? eventTitle : text, urtext }),
      tdue: dateOr({ date: tdue }),
      tfin: dateOr({ date: tfin }),
      timezone,
      tini: dateOr({ date: tini }),
      urtext,
      username,
      what: text,
    };

    // log.debug('Pledge.parse() finish', parsedPlege);

    return parsedPlege;
  }

  public static diff = (oldPromise, newPromise) =>
    _(oldPromise)
      .omit(['cred', 'createdAt', 'updatedAt'])
      .mapValues((value, key) => {
        const newValue = newPromise[key];
        return _.isEqual(value, newValue) ? undefined : newValue;
      })
      .omitBy(_.isUndefined)
      .value()
}

export default PledgeParser;
