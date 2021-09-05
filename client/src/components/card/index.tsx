import React from 'react';
import styled from 'styled-components';

import { cardClassesFor } from 'lib/helpers/calculate';
import { creditColor } from 'lib/helpers/colors';

import { blueBorder, lightGray, whiteGray} from 'lib/theme/colors';
import CardDetails from 'src/components/card/details';
import CardFooter from 'src/components/card/footer';
import CardHeader from 'src/components/card/header';
import ConfirmModal from 'src/components/modal/confirm';

const CardWrapper = styled.div`
  background: ${({ credit }) => creditColor(credit)};
  border: 1px groove ${blueBorder};
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  position: relative;
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

interface ICardProps {
  promise: IPledge;
  user: IUser;
  withHeader?: boolean;
}

const completePromise = ({ id }) => (evt) => {
  evt.preventDefault();

  ConfirmModal('Complete', 'question').then((result) => {
    if (result.value) {
      // FIXME abstract these out
      fetch('/api/v1/promise/complete', {
        body: JSON.stringify({ id }),
        headers: {
          'content-type': 'application/json',
        },
        method: 'POST',
      }).then(({ status }) => {
        if (status === 200) {
          window.location.replace(`//${window.location.host}`);
        }
      });
    }
  });
};

const Card: React.SFC<ICardProps> = ({
  promise: { id, clix, credit, tfin, what, note, tdue, urtext },
  user: { counted = 0, pending = 0, score = 0, username = '' } = {},
  withHeader,
}) => (
  <CardWrapper className={cardClassesFor({ tfin, clix })} credit={credit}>
    { withHeader &&
      <CardHeader counted={counted} pending={pending} score={score} username={username} />
    }
    <CardDetails what={what} note={note} tdue={tdue} username={username} urtext={urtext} />
    <CardFooter completePromise={completePromise} credit={credit} id={id} tfin={tfin} urtext={urtext} username={username} />
  </CardWrapper>
);

export default Card;
