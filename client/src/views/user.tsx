import _ from 'lodash';
import * as React from 'react';
import { withRouter } from 'react-router-dom';

import Card from 'src/components/card';
import LoadableContainer from 'src/components/loading/loadable';

interface IUserPromisesState {
  promises?: any[];
}

interface IUserPromisesProps {
  match: { params: { user: string } };
}

class UserPromises extends React.Component<IUserPromisesProps, IUserPromisesState> {
  public state = {
    promises: [],
  };

  public componentDidMount() {
    const { match: { params: { user: username = '' } = {} } = {} } = this.props;
    fetch(`/api/v1/user/promises?username=${username}`)
      .then((response) => {
        response.json()
          .then(({ promises }) => {
            // console.log('data', promises);
            this.setState({ promises });
          });
      });
  }

  public render() {
    const { promises } = this.state;

    return (
      <LoadableContainer isLoaded={!!promises.length}>
        { _.map(promises, (promise) => (
          <Card key={promise.id} promise={promise} user={promise.user} />
        )) }
      </LoadableContainer>
    );
  }
}

export default withRouter(UserPromises);
