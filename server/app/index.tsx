import express from 'express'
import useragent from 'express-useragent'
import { readFile } from 'fs'
import { join } from 'path'

import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { ServerStyleSheet } from 'styled-components'

import { PORT } from 'lib/config'
import log from 'lib/logger'
import apiRouter from 'server/app/api'
import dataPreloader from 'server/middleware/data'
import addMetadata from 'server/middleware/metadata'

import App from 'src/app'

const clientBuildDir = '../../client'

const app = express()

app.use(useragent.express())

app.enable('trust proxy')

app.use(express.json())
app.use(express.urlencoded({
  extended: false
}))

app.use(express.static(join(__dirname, clientBuildDir)))

app.listen(PORT, () => {
  log.info(`The commits.to app is running on port ${PORT}`)
})

app.use('/api/v1', apiRouter)
app.use(addMetadata)
app.use(dataPreloader)

// catch-all
app.get('*', ({ data = '{}', headers: { host = 'localhost' } = {}, url }, res) => {
  Sentry.init({
    dsn: 'https://cf18c1e7ce7643618d3f2583cc1e8b72@o4504271213756416.ingest.sentry.io/4504271219326979',
    integrations: [new BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0
  })

  const sheet = new ServerStyleSheet()
  const indexFile = join(__dirname, clientBuildDir, 'app.html')

  const context = {
    data: JSON.parse(data),
    host
  }

  const reactApp = renderToString(
    sheet.collectStyles(
      <div id="root">
        <StaticRouter location={url} context={context}>
          <App />
        </StaticRouter>
      </div>
    )
  )

  readFile(indexFile, 'utf8', (err, page) => {
    if (err != null) {
      log.error('Error loading index file', err)
      return res.status(500).send('500')
    }

    const styleTags = sheet.getStyleTags()
    const staticContext = JSON.stringify(context)

    page = page.replace('%{data}', staticContext)
    page = page.replace('%{root}', reactApp)
    page = page.replace('%{styles}', styleTags)

    return res.send(page)
  })
})

export default app
