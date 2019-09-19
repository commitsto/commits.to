import _ from 'lodash';
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { creditColor } from 'lib/helpers/colors';
import { prettyPercent } from 'lib/helpers/format';
import DomainParser from 'lib/parse/domain';
import { blue, white } from 'lib/theme/colors';

import LoadableContainer from 'src/components/loading/loadable';
import PromiseCard from 'src/components/promise/card';

const UserPromisesWrapper = styled.div`
  border: 1px solid ${blue};
  padding: 1rem;
`;

const UserPromisesList = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const UserHeader = styled.div`
  align-items: center;
  background: ${({ credit }) => creditColor(credit)};
  color: ${white};
  display: flex;
  margin: -1rem -1rem 1rem;
  padding: 1rem;
  text-transform: capitalize;
`;

const UserHeaderName = styled.h2`
  font-size: 1.5rem;
  margin: 0;
`;

const UserPromiseStat = styled.div`
  display: block;
  font-size: 75%;
  letter-spacing: .1875em;
  opacity: .5;
  text-align: right;
`;

const UserReliability = styled.span`
  color: ${white};
  font-size: 1.5rem;
  font-weight: 300;
  margin-left: auto;
`;

interface IUserPromisesState {
  promises?: any[];
  stats?: {
    counted?: number;
    pending?: number;
    reliability?: number;
  };
}

interface IUserPromisesProps {
  match: { params: { user: string } };
}

class UserPromises extends React.Component<IUserPromisesProps, IUserPromisesState> {
  public state = {
    promises: [],
    stats: undefined,
  };

  public componentDidMount() {
    const username = DomainParser.getUsername(window.location.hostname);

    fetch(`/api/v1/user/promises?username=${username}`)
      .then((response) => {
        response.json()
          .then(({ promises, counted, pending, reliability }) => {
            // console.log('data', promises);
            this.setState({ promises, stats: { counted, pending, reliability } });
          });
      });
  }

  public render() {
    const { promises, stats: { counted = 0, pending = 0, reliability = 0 } = {} } = this.state;
    const username = DomainParser.getUsername(window.location.hostname);

    return (
      <UserPromisesWrapper>
        <UserHeader credit={reliability}>
          <UserHeaderName>
            { username }
          </UserHeaderName>
          <UserReliability>
            { prettyPercent(reliability) }
            <UserPromiseStat>
              { counted }
              <UserPromiseStat>
                [+{ pending }]
              </UserPromiseStat>
            </UserPromiseStat>
          </UserReliability>
        </UserHeader>
        <UserPromisesList>
          <LoadableContainer isLoaded={!!promises.length}>
            { _.map(promises, (promise) => (
              <PromiseCard key={promise.id} promise={promise} user={promise.user} />
            )) }
          </LoadableContainer>
        </UserPromisesList>
      </UserPromisesWrapper>
    );
  }
}

export default withRouter(UserPromises);
