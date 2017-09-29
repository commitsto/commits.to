// Take urtext and return a promise data structure
export default function parsePromise(urtx) {
  let m = urtx.match(/^([^\.]+)\.(promises|commits)\.to\/(.*)$/)
  // TODO: handle the case that no user is given, just "promises.to/foo"
  let user = m ? m[1] : ''
  let domain = m ? m[2] : ''
  let path = m ? m[3] : ''
  let what = ''
  let tdue = Date.now() + 7*24*60*60*1000
  if (path.length > 0) {
    let parsedPath = path.match(/^(.*?)(\/by\/|$)(.*)$/)
    what = parsedPath[1] //.replace(/_/g, ' ')
    //tdue = parsedPath.length > 1 ? 
    //       chrono.parseDate(parsedPath[3].replace(/_/g, ' ')) * 1 : 
    //       Date.now() + 7*24*60*60*1000
    //tdue = tdue ? ( ( tdue < Date.now() && Date.now() - tdue < 24*60*60*1000 ) ?
    //                tdue + 24*60*60*1000 : tdue )
    //            : Date.now() + 7*24*60*60*1000
    tdue = parsedPath[3]
  }
  // TODO: path is now everything after ".promises.to" so now parse out the 
  //       "what" (thing being promised) and the "tdue" (deadline)
  console.log('parseProm', { user, path, domain, what, tdue, urtx })
  return { user, path, domain, what, tdue, urtx, tini: Date.now() }
}