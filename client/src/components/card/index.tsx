import * as React from 'react';
import styled from 'styled-components';

import { cardClassesFor } from 'lib/helpers/calculate';
import { creditColor } from 'lib/helpers/colors';

import { blueBorder, lightGray, whiteGray} from 'lib/theme/colors';
import CardDetails from 'src/components/card/details';
import CardFooter from 'src/components/card/footer';
import CardHeader from 'src/components/card/header';

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

export interface IUser {
  counted?: number;
  pending?: number;
  score?: number;
  username?: string;
}

export interface IPromise {
  id?: string;
  clix?: number;
  credit?: number;
  what?: string;
  note?: string;
  tdue?: Date;
  tfin?: Date;
  username?: string;
  urtext?: string;
  user?: {};
}

interface ICardProps {
  user: IUser;
  promise: IPromise;
}

const Card: React.SFC<ICardProps> = ({
  user: { counted = 0, pending = 0, score = 0, username = '' } = {},
  promise: { id, clix, credit, tfin, what, note, tdue, urtext },
}) => (
  <CardWrapper className={cardClassesFor({ tfin, clix })} credit={clix === 1 ? -1 : credit}>
    <CardHeader counted={counted} pending={pending} score={score} username={username} />
      <CardDetails what={what} note={note} tdue={tdue} username={username} urtext={urtext} />
      <CardFooter credit={credit} id={id} tfin={tfin} urtext={urtext} username={username} />
  </CardWrapper>
);

export default Card;
