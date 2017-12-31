

import express from 'express'
import expressHandlebars from 'express-handlebars'
import sassMiddleware from 'node-sass-middleware'

import { APP_PATH, PORT } from '../data/config'
import log from '../lib/logger'
import '../helpers/calculate'
import '../helpers/colors'
import '../helpers/format'
import '../helpers/utils'

const app = express()

app.use(sassMiddleware({
  src: `${APP_PATH}styles`,
  dest: `${APP_PATH}public`,
  force: true, // FIXME: glitch needed this at one point?
  // debug: true,
  // outputStyle: 'compressed',
}))

app.enable('trust proxy')

app.use(express.static(`${APP_PATH}styles`))
app.use(express.static(`${APP_PATH}public`))

app.engine('handlebars', expressHandlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.use(express.json())
app.use(express.urlencoded({
  extended: false
}))

app.listen(PORT, () => {
  log.info(`The commits.to app is running on port ${PORT}`)
})

export default app
