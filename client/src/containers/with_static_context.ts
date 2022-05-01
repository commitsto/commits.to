import { isEmpty } from 'lodash';
import { withRouter } from 'react-router-dom';
import { compose, withProps } from 'recompose';

const withStaticContext = withProps(({
  staticContext: { data: staticData = {}, host = '' } = {}
}) => {
  const isClient = () => typeof window !== 'undefined';
  const clientData = isClient ? (window as any).__staticContext?.data : {};

  const data = !isEmpty(staticData) ? staticData : clientData;

  return { data, host };
});

export default compose(
  withRouter,
  withStaticContext
);
