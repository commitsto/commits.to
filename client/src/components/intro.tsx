import React from 'react'
import styled from 'styled-components'

const IntroSubHeading = styled.h3`
  margin-top: 0;
`

const Intro: React.SFC<{}> = () => (
  <div className='intro'>
    <IntroSubHeading>
      a.k.a. The I-Will System
    </IntroSubHeading>
    <p>
      Create a commitment by constructing a URL like "<b>alice.commits.to/send_the_report</b>" and just by clicking on such a URL, a commitment is logged here.
    </p>
  </div>
)

export default Intro
