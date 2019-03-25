import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Route, Switch } from 'react-router-dom';

import DomainParser from 'lib/parse/domain';

import MainLayout from 'src/layout/main';

import Edit from 'src/views/edit';
import Home from 'src/views/home';
import View from 'src/views/promise';
import User from 'src/views/user';

const App = () => (
  <MainLayout>
    <Switch>
      { DomainParser.hasSubdomain(window.location.host) ?
        <Route exact path='/' component={User} />
        :
        <Route exact path='/' component={Home} />
      }
      <Route path='/edit/:id' component={Edit} />
      <Route path='/:id' component={View} />
    </Switch>
  </MainLayout>
);

export default hot(module)(App);
