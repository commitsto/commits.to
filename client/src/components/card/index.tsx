import * as React from 'react';
import styled from 'styled-components';

import { cardClassesFor } from 'lib/helpers/calculate';
import { creditColor } from 'lib/helpers/colors';

import CardDetails from 'src/components/card/details';
import CardFooter from 'src/components/card/footer';
import CardHeader from 'src/components/card/header';
import { blueBorder, lightGray, whiteGray} from 'src/theme/colors';

const CardWrapper = styled.div`
  background: ${({ credit }) => creditColor(credit)};
  border: 1px groove ${blueBorder};
  display: flex;
  flex: 1 1 auto;
  flex-wrap: wrap;
  overflow: hidden;
  position: relative;
  margin: .5rem;
  opacity: .95;
  transition: border .5s ease-out, opacity .3s ease-in-out;

  &:hover {
    border-color: ${whiteGray};
    opacity: 1;
  }

  /* FIXME */
  &.completed {
    background-color: #FFFFFF0d;
    border-color: ${lightGray};
  }

  &.voided {
    background-color: transparent;
    border-color: ${lightGray};

    .promise-bar-link {
      display: none;
    }
  }
`;

// <div className='promise-card {{ promise}} {{dueColor (dueStatus promise.tdue)}}'>

const Card = ({ user = {}, promise }) => (
  <CardWrapper className={cardClassesFor(promise)} credit={promise.clix === 1 ? -1 : promise.credit}>
    <CardHeader {...user} />
    <CardDetails {...promise} username={user.username} />
    <CardFooter {...promise} />
  </CardWrapper>
);

export default Card;
