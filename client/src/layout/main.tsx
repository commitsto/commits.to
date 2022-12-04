import { library } from '@fortawesome/fontawesome-svg-core'
import { faCalendarAlt, faClock } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'

import Footer from 'src/layout/elements/footer'
import Header from 'src/layout/elements/header'

import ThemeColors from 'lib/theme/colors'

const { black, white, blue } = ThemeColors

const DarkBackground = createGlobalStyle`
  body {
    background-color: ${black};
    font-family: helvetica, arial, sans-serif;
    padding: 0;
    margin: 0;
  }

  h1, .bold {
    font-weight: bold;
  }

  h1, h2, h3, h4, h5, p, ul {
    color: ${white};
  }

  a {
    color: ${blue};
    text-decoration: none;
  }
`

const MainContainer = styled.main`
  padding: 2rem;
`

library.add(faCalendarAlt, faClock)

const MainLayout = ({ children }) => (
  <div>
    <DarkBackground />
    <Header title='commits.to' />
    <MainContainer>
      { children }
    </MainContainer>
    <Footer />
  </div>
)

export default MainLayout
