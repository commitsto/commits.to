import { compose, withProps } from 'recompose';

import DomainParser from 'lib/parse/domain';
import withStaticContext from 'src/containers/with_static_context';

const withParsedDomain = withProps(({ host }) => {
  const isClient = () => typeof window !== 'undefined';
  const hoststring = host || (isClient() && window.location.host);

  return { domain: DomainParser.parse(hoststring) };
});

export default compose(
  withStaticContext,
  withParsedDomain
);
