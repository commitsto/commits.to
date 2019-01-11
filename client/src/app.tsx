import * as React from 'react';
import { hot } from 'react-hot-loader';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import MainLayout from 'src/layout/main';

import Home from 'src/views/home';
import View from 'src/views/promise';
// import User from 'src/views/user';

const App = () => (
  <BrowserRouter>
    <MainLayout>
      <Switch>
        <Route exact path='/' component={Home} />
        {/* <Route path='/:user' component={User} /> */}
        <Route path='/:user/:id' component={View} />
      </Switch>
    </MainLayout>
  </BrowserRouter>
);

export default hot(module)(App);
