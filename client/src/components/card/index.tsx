import * as React from 'react';
import styled from 'styled-components';

import CardDetails from 'src/components/card/details';
import CardFooter from 'src/components/card/footer';
import CardHeader from 'src/components/card/header';
import { blue, blueBorder, whiteGray } from 'src/theme/colors';

const CardWrapper = styled.div`
  background-color: ${blue};
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
`;

// <div className='promise-card {{cardClassesFor promise}} {{dueColor (dueStatus promise.tdue)}}'>

const Card = ({ user, promise }) => (
  <CardWrapper>
    <CardHeader {...user} />
    <CardDetails {...promise} />
    <CardFooter {...promise} />
  </CardWrapper>
);

export default Card;
