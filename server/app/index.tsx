import express from 'express';
import useragent from 'express-useragent';
import { openSync, readFile } from 'fs';
import { join } from 'path';

import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { ServerStyleSheet } from 'styled-components';

import App from 'src/app';

import { PORT } from 'lib/config';
import log from 'lib/logger';
import apiRouter from 'server/app/api';

const clientBuildDir = '../../client';

const app = express();

app.use(useragent.express());

app.enable('trust proxy');

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

app.use(express.static(join(__dirname, clientBuildDir)));

app.listen(PORT, () => {
  log.info(`The commits.to app is running on port ${PORT}`);

  // Notify NGINX to start serving
  openSync('/tmp/app-initialized', 'w');
});

app.use('/api/v1', apiRouter);

// catch-all
app.get('*', (req, res) => {
  log.info('*** render front-end', req.originalUrl);
  const indexFile = join(__dirname, clientBuildDir, 'app.html');

  const context = {
    host: req.headers.host,
    // promise: {} // TODO
  };

  const sheet = new ServerStyleSheet();

  const reactApp = renderToString(
    sheet.collectStyles(
      <StaticRouter location={req.url} context={context}>
        <App />
      </StaticRouter>
    )
  );

  readFile(indexFile, 'utf8', (err, page) => {
    if (err) {
      log.error('Error loading index file', err);
      return res.status(500).send('500');
    }

    const styleTags = sheet.getStyleTags();

    page = page.replace('%{root}', `<div id="root">${reactApp}</div>`);
    page = page.replace('%{styles}', styleTags);

    return res.send(page);
  });
});

export default app;
