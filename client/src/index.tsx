import * as React from 'react';
import { render } from 'react-dom';
import * as ReactGA from 'react-ga';

import App from 'src/app';

const root = document.createElement('div');
document.body.appendChild(root);

render(<App />, root);

ReactGA.initialize('UA-121792102-1');
ReactGA.pageview(window.location.pathname + window.location.search);
