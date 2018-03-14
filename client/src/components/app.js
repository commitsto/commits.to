import React from 'react'
import ReactDOM from 'react-dom'
import { hot } from 'react-hot-loader'

import '../styles/main.scss'

const App = () => {
  return (
    <main>
      <h1>commits.to!</h1>
      <p>the iwill system</p>
    </main>
  )
}

export default hot(module)(App)

ReactDOM.render(<App />, document.getElementById('root'))
