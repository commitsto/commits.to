import DomainParser from 'lib/parse/domain'

export default (req, res, next) => {
  const { hasSubdomain, subdomain: username } = DomainParser.parse(req.hostname)

  if (hasSubdomain) {
    req.metadata = {
      urtext: req.url,
      username
    }
  }

  next()
}
