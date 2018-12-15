import * as React from 'react'
import { hot } from 'react-hot-loader'

import MainLayout from 'src/layout/main';

import Signup from 'src/views/signup';

const App = () => (
  <MainLayout>
    <Signup />
  </MainLayout>
);

export default hot(module)(App);
