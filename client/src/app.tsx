import React from 'react';
import { hot } from 'react-hot-loader';
import { Route, Switch } from 'react-router-dom';

import routes from 'lib/routes';
import withParsedDomain from 'src/containers/with_parsed_domain';
import MainLayout from 'src/layout/main';

const App = withParsedDomain(({ domain: { hasSubdomain = false } = {} }) => (
  <MainLayout>
    <Switch>
      { routes({ hasSubdomain }).map((route, idx) => <Route key={idx} {...route} />) }
    </Switch>
  </MainLayout>
));

export default hot(module)(App);
