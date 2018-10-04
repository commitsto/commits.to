import express from 'express'
import expressHandlebars from 'express-handlebars'
import sassMiddleware from 'node-sass-middleware'
import useragent from 'express-useragent'

import '../../helpers'

import { PORT } from './config'
import log from '../../lib/logger'


const app = express()

app.use(useragent.express())

app.use(sassMiddleware({
  src: 'styles',
  dest: 'public',
  force: true, // FIXME: glitch needed this at one point?
  // debug: true,
  // outputStyle: 'compressed',
}))

app.enable('trust proxy')

app.use(express.static('styles'))
app.use(express.static('public'))

app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.json())
app.use(express.urlencoded({
  extended: false
}))

app.listen(PORT, () => {
  log.info(`The commits.to app is running on port ${PORT}`)
})

export default app
