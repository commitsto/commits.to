let express = require('express')
let z = express.Router()

import path from 'path'

function nein(req, resp) {
  let neinfile = path.resolve(__dirname+'/../public/nein.html')
  return resp.status(404).sendFile(neinfile)
}

/*******************************************************************************
The deal with routing:
1. The subdomain handler turns URLs like 
   "alice.commits.to/foo_bar/baz" into 
   "/_s/alice/foo_bar/baz" 
   (the "_s" is a magic string. https://en.wikipedia.org/wiki/Magic_string )
   It's the "/_s/..." version that the router matches on.
2. There are a million gotchas and bugs with trying to use Express's partial
   regex syntax -- eg, https://github.com/expressjs/express/issues/2495 -- so we
   want to use actual regexes as the thing to match on here instead of strings.
3. If we wanted to use the string version, here's a handy route tester to see
   how things get matched: https://wesleytodd.github.io/express-route-tester
4. This file is processed before the stuff in router.js and maybe after the 
   stuff in api.js
5. Dots aren't allowed anymore so we don't have to individually route various
   things that rogue bots and things will try to GET, but in case we change our
   mind about dots then we'll need those so they're here commented out.
6. Any file in /public will automatically get served first before any of this
   routing.
*******************************************************************************/

/*******************************************************************************
// Things we might actually want to serve but don't currently serve:
z.get(/^\/_s\/(\w+)\/test\d*\.txt$/, nein) // eg test123.txt
z.get(/^\/_s\/(\w+)\/favicon\.ico$/, nein)
z.get(/^\/_s\/(\w+)\/apple-touch-icon.*\.png$/, nein)

// Things rogue bots or pentesters have tried to GET:
z.get(/^\/_s\/(\w+)\/xmlrpc\.php$/, nein)
z.get(/^\/_s\/(\w+)\/cms\/wp-includes\/wlwmanifest\.xml$/, nein)
z.get(/^\/_s\/(\w+)\/hirevmcyvpgypnk\.html$/, nein)
z.get(/^\/_s\/(\w+)\/blog\/wp-includes\/wlwmanifest\.xml$/, nein)
z.get(/^\/_s\/(\w+)\/site\/wp-includes\/wlwmanifest\.xml$/, nein)
z.get(/^\/_s\/(\w+)\/wordpress\/wp-includes\/wlwmanifest\.xml$/, nein)
z.get(/^\/_s\/(\w+)\/wp-includes\/wlwmanifest\.xml$/, nein)
z.get(/^\/_s\/(\w+)\/wp\/wp-includes\/wlwmanifest\.xml$/, nein)
*******************************************************************************/

// Legacy redirects which I think eventually we need to provide a UI for so that
// the user can create these to their heart's delight whenever they, eg, give
// out a URL with a typo or an old promise is subsumed by an new one or whatever
z.get(/^\/_s\/alice\/old-url-testing\/?$/, (q, r) => r.redirect('/new-url')) 

z.get(/^\/_s\/sergii\/work_on_points_2_to_4\/by\/next_monday\/?$/, nein)

z.get(/^\/_s\/philip\/implement-commits\.to-alfred-workflow\/by\/1-hour\/?$/,
  (q, r) => r.redirect('/implement-commits-to-alfred-workflow/by/1-hour'))

z.get(/^\/_s\/daniel\/make_a_commits.to_PR\/by\/march_1\/?$/,
  (q, r) => r.redirect('make_a_commits-to_PR/by/march_1'))

z.get(/^\/_s\/dreev\/finish_implementing_this_system\/?$/, 
  (q, r) => r.redirect('/finish_implementing_this_system/by/january'))
z.get(/^\/_s\/dreev\/send_the_dang_belated_yearly_beemail\/by\/?$/, 
  (q, r) => r.redirect('/send_the_dang_belated_yearly_beemail/by/next_week'))
z.get(/^\/_s\/dreev\/update_kenoubi_re_road_editor\/by\/?$/,
  (q, r) => r.redirect('/update_kenoubi_re_road_editor/by/jan_18'))

z.get(/^\/_s\/kim\/ask_J\&B_about\/?$/,
  (q, r) => r.redirect('/ask_J_and_B_about'))
z.get(/^\/_s\/kim\/ask_joe\&bjorn_about\/?$/,
  (q, r) => r.redirect('/ask_joe_and_bjorn_about'))

z.get(/^\/_s\/bee\/schedule-planning-with-cantor\/by\/friday-night\/?$/, 
  (q, r) => r.redirect('/clean_up_old_commitments/by/9pm'))
z.get(/^\/_s\/bee\/reping-one-with-heart\/?$/,
  (q, r) => r.redirect('/clean_up_old_commitments/by/9pm'))
z.get(/^\/_s\/bee\/put-away-camping-gear-this-weekend\/?$/,
  (q, r) => r.redirect('/clean_up_old_commitments/by/9pm'))
z.get(/^\/_s\/bee\/call_jacob_this_week\/by\/next_week\/?$/,
  (q, r) => r.redirect('/clean_up_old_commitments/by/9pm'))
z.get(/^\/_s\/bee\/fill-out-metromile-feedback\/?$/,
  (q, r) => r.redirect('/clean_up_old_commitments/by/9pm'))
z.get(/^\/_s\/bee\/fill_out_metromile_feedback\/?$/,
  (q, r) => r.redirect('/clean_up_old_commitments/by/9pm'))
z.get(/^\/_s\/bee\/read-hannas-emails\/?$/,
  (q, r) => r.redirect('/clean_up_old_commitments/by/9pm'))
z.get(/^\/_s\/bee\/email-sleep-as-android-for-specifics-about-sleep-length-measurement\/?$/,
  (q, r) => r.redirect('/clean_up_old_commitments/by/9pm'))
z.get(/^\/_s\/bee\/experiment_with_manual_sleep_as_android\/by\/5pm\/?$/,
  (q, r) => r.redirect('/clean_up_old_commitments/by/9pm'))
z.get(/^\/_s\/bee\/rest-of-paperwork-to-yoko-before-the-gym-tomorrow\/?$/,
  (q, r) => r.redirect('/clean_up_old_commitments/by/9pm'))
z.get(/^\/_s\/bee\/new-family-photo-to-yoko\/by\/tomorrow-night\/?$/,
  (q, r) => r.redirect('/clean_up_old_commitments/by/9pm'))
z.get(/^\/_s\/bee\/reply-to-hin\/by\/tuesday\/?$/,
  (q, r) => r.redirect('/clean_up_old_commitments/by/9pm'))
z.get(/^\/_s\/bee\/reply_to_hin\/by\/tuesday\/?$/,
  (q, r) => r.redirect('/clean_up_old_commitments/by/9pm'))
z.get(/^\/_s\/bee\/go_to_bed\/by\/11pm\/?$/,
  (q, r) => r.redirect('/clean_up_old_commitments/by/9pm'))

// Here's where we reject URLs with bad characters but it would be better to
// specify a big regex defining exactly what *does* count as a valid promise URL
// and reject everything else.
// NB: Rejecting '#' is moot because we don't see them; the browser eats them.
// Also this isn't matching on query string so rejecting '?' here doesn't help.
// That might be pretty important to fix.
// Things we might want to reject but that at least one existing promise 
// in the database currently uses include:
//   at (@) -- just 1 so far!
//   colon (:) -- just 8 so far but pretty useful for times of day!
//   slash (/) -- hundreds :(
z.get(/^\/_s\/(\w+)\/.*[\!\%\$\^\*\(\)\[\]\=\+\{\}\\\|\;\'\"\`\~\.\&].*$/, 
  nein)

module.exports = z
