import express from 'express'
import useragent from 'express-useragent'
import path from 'path';

import { PORT } from '../../lib/config'
import log from '../../lib/logger'
import apiRouter from './api';

const app = express()

app.use(useragent.express())

app.enable('trust proxy')

app.use(express.json())
app.use(express.urlencoded({
  extended: false
}))

app.use(express.static(path.join(__dirname, '../../build')));

app.listen(PORT, () => {
  log.info(`The commits.to app is running on port ${PORT}`)
})

app.use('/api/v1', apiRouter);

// catch-all
app.get('*', (req, res) => {
  log.info('render front-end', req.originalUrl)
  res.sendFile(path.join(`${__dirname}/../../build/index.html`))
})

export default app
