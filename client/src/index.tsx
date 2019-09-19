import * as React from 'react';
import { hydrate } from 'react-dom';
import * as ReactGA from 'react-ga';
import { BrowserRouter } from 'react-router-dom';

import App from 'src/app';

hydrate((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('root'));

ReactGA.initialize('UA-121792102-1');
ReactGA.pageview(window.location.pathname + window.location.search);
