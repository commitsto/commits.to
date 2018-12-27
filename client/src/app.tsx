import * as React from 'react';
import { hot } from 'react-hot-loader';
import { BrowserRouter, Route } from 'react-router-dom';

import MainLayout from 'src/layout/main';

import Home from 'src/views/home';

const App = () => (
  <MainLayout>
    <BrowserRouter>
      <Route exact path='/' component={Home} />
    </BrowserRouter>
  </MainLayout>
);

export default hot(module)(App);
