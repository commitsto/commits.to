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
  
  
  // quick hack to make it so both bob.commits.to and bob.commits.to/ 
  // show the full list of promises:
  urtx = urtx.replace(/\/$/, '')
  
  // Parse the urtext into user, what, whom, tini, tdue, etc
  // Check if a promise already exists with matching user+'|'+what
  // If not, create it
  // If so, do nothing
  let p = parsePromise(urtx)
  console.log(`DEBUG ${JSON.stringify(p)}`)
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

