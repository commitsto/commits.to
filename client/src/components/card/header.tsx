import _ from 'lodash'
import React from 'react'
import styled from 'styled-components'

import StyledLink from 'src/components/styled/link'
import withParsedDomain from 'src/containers/with_parsed_domain'

import { scoreColor } from 'lib/helpers/colors'
import { prettyPercent } from 'lib/helpers/format'
import { userPath } from 'lib/helpers/path'

import { grayBlue, lightGray } from 'lib/theme/colors'

const HeaderWrapper = styled.div`
  background-color: ${grayBlue};
  padding: .75rem 1rem;
  position: relative;
`

const UserHeading = styled.h2`
  letter-spacing: .05rem;
  margin: 0;
  text-transform: capitalize;
`

const UserScore = styled.div`
  color: ${({ score }) => scoreColor(score)};
  font-size: 1.25rem;
  letter-spacing: .025rem;
  opacity: .85;
`

const UserCounted = styled.div`
  font-weight: bold;
  color: ${lightGray};
  letter-spacing: .05rem;
  line-height: .85em;
`

const UserPending = styled.span`
  font-size: 75%;
  font-weight: 300;
  vertical-align: text-top;
`

const CardHeader = ({ domain: { root: host = '' } = {}, username, score, counted, pending }) => (
  <HeaderWrapper>
    <UserHeading>
      <StyledLink href={userPath({ host, username })}>
        { username }
      </StyledLink>
    </UserHeading>
    <UserScore score={score}>
      <span>{ prettyPercent(score, 2) }</span>
    </UserScore>
    <UserCounted>
      { counted }
      <UserPending>
        [+{ pending }]
      </UserPending>
    </UserCounted>
  </HeaderWrapper>
)

export default withParsedDomain(CardHeader)
