import * as _ from 'lodash';
import * as React from 'react';
import styled from 'styled-components';

import StyledLink from 'src/components/styled/link';

import { scoreColor } from 'lib/helpers/colors';
import { prettyPercent } from 'lib/helpers/format';

import { grayBlue, lightGray } from 'src/theme/colors';

const HeaderWrapper = styled.div`
  background-color: ${grayBlue};
  padding: .75rem 1rem;
  position: relative;
`;

const UserHeading = styled.h2`
  letter-spacing: .05rem;
  margin: 0;
  text-transform: capitalize;
`;

const UserScore = styled.div`
  color: ${({ score }) => scoreColor(score)};
  font-size: 1.25rem;
  letter-spacing: .025rem;
  opacity: .85;
`;

const UserCounted = styled.div`
  font-weight: bold;
  color: ${lightGray};
  letter-spacing: .05rem;
  line-height: .85em;
`;

const UserPending = styled.span`
  font-size: 75%;
  font-weight: 300;
  vertical-align: text-top;
`;

interface ICardHeaderProps {
  counted: number;
  pending: number;
  score: number;
  username: string;
}

const CardHeader = ({ username, score, counted, pending }) => (
  <HeaderWrapper>
    <UserHeading>
      <StyledLink to='#userPath'>
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
);

export default CardHeader;
