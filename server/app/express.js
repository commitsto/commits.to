import express from 'express'
import useragent from 'express-useragent'

import { PORT } from './config'
import log from '../../lib/logger'


const app = express()

app.use(useragent.express())

app.enable('trust proxy')

// app.use(express.static('public'))

app.use(express.json())
app.use(express.urlencoded({
  extended: false
}))

app.listen(PORT, () => {
  log.info(`The commits.to app is running on port ${PORT}`)
})

// catch-all
// app.get('*', (req, res) => {
//   log.info('render 401', req.originalUrl)
//   res.send(401)
// })

export default app
