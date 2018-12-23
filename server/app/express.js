import express from 'express'
import sassMiddleware from 'node-sass-middleware'
import useragent from 'express-useragent'

import { PORT } from './config'
import log from '../../lib/logger'


const app = express()

app.use(useragent.express())

app.use(sassMiddleware({
  src: 'styles',
  dest: 'public',
}))

app.enable('trust proxy')

app.use(express.static('styles'))
app.use(express.static('public'))

app.use(express.json())
app.use(express.urlencoded({
  extended: false
}))

app.listen(PORT, () => {
  log.info(`The commits.to app is running on port ${PORT}`)
})

export default app
