import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Route, Switch } from 'react-router-dom';

import routes from 'lib/routes';
import MainLayout from 'src/layout/main';

const App = () => (
  <MainLayout>
    <Switch>
      { routes.map((route, idx) => <Route key={idx} {...route} />) }
    </Switch>
  </MainLayout>
);

export default hot(module)(App);
