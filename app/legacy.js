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
*******************************************************************************/

// Paths to files we might want to serve but that don't currently exist
// (any files in /public will automatically get served)
z.get(/^\/_s\/(\w+)\/test\d*\.txt$/, nein) // eg test123.txt
z.get(/^\/_s\/(\w+)\/favicon\.ico$/, nein)
z.get(/^\/_s\/(\w+)\/apple-touch-icon.*\.png$/, nein)

// Things rogue bots or pentesters have tried to GET
z.get(/^\/_s\/(\w+)\/xmlrpc\.php$/, nein)
z.get(/^\/_s\/(\w+)\/cms\/wp-includes\/wlwmanifest\.xml$/, nein)
z.get(/^\/_s\/(\w+)\/hirevmcyvpgypnk\.html$/, nein)
z.get(/^\/_s\/(\w+)\/blog\/wp-includes\/wlwmanifest\.xml$/, nein)
z.get(/^\/_s\/(\w+)\/site\/wp-includes\/wlwmanifest\.xml$/, nein)
z.get(/^\/_s\/(\w+)\/wordpress\/wp-includes\/wlwmanifest\.xml$/, nein)
z.get(/^\/_s\/(\w+)\/wp-includes\/wlwmanifest\.xml$/, nein)
z.get(/^\/_s\/(\w+)\/wp\/wp-includes\/wlwmanifest\.xml$/, nein)

// Legacy redirects which I think eventually we need to provide a UI for so that
// the user can create these to their heart's delight whenever they, eg, give
// out a URL with a typo or an old promise is subsumed by an new one or whatever
z.get(/^\/_s\/alice\/old-url-testing\/?$/, (q, r) => r.redirect('/new-url')) 

z.get(/^\/_s\/dreev\/finish_implementing_this_system\/?$/, 
  (q, r) => r.redirect('/finish_implementing_this_system/by/january'))
z.get(/^\/_s\/dreev\/send_the_dang_belated_yearly_beemail\/by\/?$/, 
  (q, r) => r.redirect('/send_the_dang_belated_yearly_beemail/by/next_week'))
z.get(/^\/_s\/dreev\/update_kenoubi_re_road_editor\/by\/?$/,
  (q, r) => r.redirect('/update_kenoubi_re_road_editor/by/jan_18'))

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
z.get(/^\/_s\/bee\/read-hannas-emails\/?$/,
  (q, r) => r.redirect('/clean_up_old_commitments/by/9pm'))
z.get(/^\/_s\/bee\/email-sleep-as-android-for-specifics-about-sleep-length-measurement\/?$/,
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


module.exports = z
