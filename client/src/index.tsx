import * as React from 'react';
import { hydrate } from 'react-dom';
import * as ReactGA from 'react-ga';
import { BrowserRouter } from 'react-router-dom';

import App from 'src/app';

const root = document.createElement('div');
document.body.appendChild(root);

hydrate(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  root
);

ReactGA.initialize('UA-121792102-1');
ReactGA.pageview(window.location.pathname + window.location.search);
