import DomainParser from 'lib/parse/domain';

export default (req, res, next) => {
  const parsedHost = DomainParser.parse(req.hostname);
  if (parsedHost.hasSubdomain) {
    req.pledge = {
      urtext: req.url.substr(1),
      username: parsedHost.subdomain,
    };
  }
  next();
};
