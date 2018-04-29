import * as React from 'react'
import { hot } from 'react-hot-loader'

import '../styles/main.scss'

import Header from './layout/header'
import Footer from './layout/footer'

const App = () => (
  <div>
    <Header title='commits.to' />
    <main>
      <h3 className='sub-heading'>
        a.k.a. The I-Will System
      </h3>
    </main>
    <Footer />
  </div>
)

export default hot(module)(App)
