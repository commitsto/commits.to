import mailself from './mail.js';
import parsePromise from './parse.js';
import { users } from '../data/seed.js';

import { Promise } from '../models/promise.js';

export default function handleRequest(req, resp) {
  // The server at promises.to passes along the full URL the way the user typed
  // it, so when the user hits "bob.promises.to/foo" the Glitch app is called
  // with "iwill.glitch.me/bob.promises.to/foo" and req.originalUrl is
  // "/bob.promises.to/foo" (originalUrl doesn't include the hostname)
  let urtx = req.originalUrl.substr(1); // get rid of the initial slash
  // urtx is now, eg, "bob.promises.to/foo_the_bar/by/9am"
  
  // TODO: don't try to parse a promise if no subdomain, ie, no user given
  // TODOLATER: how to handle "bob.promises.to/foo%bar"
  // TODOLATER: need to url-decode to handle "bob.promises.to/foo^bar"
  // TODOLATER: handle bob.promises.to/do_item_#2/by/9am
  //           https://stackoverflow.com/questions/18796421/capture-anchor-links
  
  console.log("DEBUG urtx:", urtx);
  
  // Parse the urtext into user, what, whom, tini, tdue, etc
  // Check if a promise already exists with matching user+'|'+what
  // If not, create it
  // If so, do nothing
  let p = parsePromise(urtx)
  
  if (p.user === 'www' || p.user === '') { 
    // this is the case of no username, like if someone just went to
    // "promises.to" or tried to fetch "promises.to/robots.txt" or whatever
    resp.render('home');
  } else if (!users.includes(p.user)) {
    resp.redirect('/sign-up')
  } else {
    Promise.findOne({ where: {urtx} })
      .then(promise => {
        let existing = false;
      
        if (promise) {
          console.log('duplicate', urtx);
          existing = true;
          // resp.redirect(urtx);
        } else {
          Promise.create(p);
          mailself('PROMISE', urtx);
        }
      
        console.log('promises.to/ request', req.params);
        resp.render('promise', {
          ...req.params,
          existing,
        });
    });
 
  }
}

/*
Little picture: Why does this error handling code not run when I surf to 
a bad URL like iwill.glitch.me/foo%bar

Bigger picture: I'm making an app that needs to process any URL the user may 
throw at it. I need the server to get the exact URL the way the user sees it in 
the browser. That's going to be especially tricky for things like '#' characters
but right now I'm just trying to figure out the case of arbitrary '%' characters
that may not correspond to proper %-encodings.

I'm thinking like a catchall error-handling route that no matter what weird
encoding or whatever error is thrown I can still have the code here do something
with the URL as the user typed it.

For now we're just dropping all this and having the app give the user an error
if there are any weird characters in the URL.

app.use(function(req, resp, next) {
  var err = null
  try {
    console.log("TRYING", req.path, req.url)
    decodeURIComponent(req.path)
  } catch(e) {
    err = e
  }
  if (err) {
    console.log("CAUGHT ERR:", err, req.url)
    return resp.redirect('/')
  }
  next();

  //console.log("DEBUG USE1:", req.originalUrl)
  //resp.redirect('/')
})
*/