// --------------------------------- 80chars ---------------------------------->

import express from 'express'
import expressHandlebars from 'express-handlebars'
import sassMiddleware from 'node-sass-middleware'

import '../helpers/calculate'
import '../helpers/colors'
import '../helpers/format'
import '../helpers/utils'

const app = express()

app.use(sassMiddleware({
  src: '/app/styles',
  dest: '/app/public',
  force: true,
  // debug: true,
  // outputStyle: 'compressed',
}))

app.enable('trust proxy')

app.use(express.static('/app/styles'))
app.use(express.static('/app/public'))

app.engine('handlebars', expressHandlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

app.listen(process.env.PORT, () => {
  console.log(`The commits.to app is running on port ${process.env.PORT}`)
})

export default app

// --------------------------------- 80chars ---------------------------------->