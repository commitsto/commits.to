// --------------------------------- 80chars ---------------------------------->
import mailself from './mail.js'
import parsePromise from './parse.js'
import { domain, users } from '../data/seed.js'
import { Promise, sequelize } from '../models/promise.js'

export default function handleRequest(req, resp) {
  // The server at promises.to passes along the full URL the way the user typed
  // it, so when the user hits "bob.promises.to/foo" the Glitch app is called
  // with "iwill.glitch.me/bob.promises.to/foo" and req.originalUrl is
  // "/bob.promises.to/foo" (req.originalUrl doesn't include the hostname which
  // from the perspective of this Glitch app is "iwill.glitch.me")
  
  // urtx is now, eg, "bob.promises.to/foo_the_bar/by/9am"
    
  //console.log('handleRequest', req.params)
  const request = req.originalUrl.substr(1) // get rid of the initial slash
  const p = parsePromise(request) // p's a hash: {user, slug, tini, tdue, etc}
  const { urtx } = p;
  
  console.log(`DEBUG: handleRequest: ${JSON.stringify(p)}`)
  
  if (p.user === 'www' || p.user === '') { 
    // this is the case of no username, like if someone just went to
    // "promises.to" or tried to fetch "promises.to/robots.txt" or whatever
    resp.redirect('/')
  } else if (!users.includes(p.user)) {
    // don't let people create new subdomains/users on the fly
    resp.redirect('/sign-up')
  } else {
    // Check if a promise already exists with matching user+'|'+what
    // If not, create it
    // If so, do nothing

    console.log('valid request', req.params)
    Promise.findOne({ where: {urtx: urtx} })
      .then(promise => {
        if (promise) {
          console.log('promise exists', urtx, promise.id)
          resp.render('promise', {
            promise,
          })
        } else {
          console.log('creating promise', urtx)
          // Promise.create(p)
          // dreev literally wants every promise emailed to him so nothing gets
          // lost while we're hacking on this so please make sure this mailself
          // function gets called whenever a promise is created:
          mailself('PROMISE', urtx)
          resp.render('create', {
            promise: p,
          })
        }     
      })
  }
}