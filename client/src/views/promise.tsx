import _ from 'lodash';
import * as React from 'react';
import { withRouter } from 'react-router-dom';

import Card from 'src/components/card';
import { IPromise } from 'src/components/card/index';
import LoadableContainer from 'src/components/loading/loadable';

// FIXME method on Promise model
const parseId = ({ id = '' }) => {
  const [ , username, ...urtext ] = id.toLowerCase().split('/');
  return { username, urtext: urtext.join('/') };
};

class Promise extends React.Component {
  public state = {
    promise: {},
  };

  public componentDidMount() {
    const { location: { pathname } = {} } = this.props;
    const { username, urtext } = parseId({ id: pathname });
    fetch(`/api/v1/promise/?username=${username}&urtext=${urtext}`)
      .then((response) => {
        response.json()
          .then(({ promise }) => {
            this.setState({ promise });
          });
      });
  }

  public render() {
    const { promise: { user, ...promise } } = this.state;
    return (
      <LoadableContainer isLoaded={!_.isEmpty(promise)}>
        <Card key={promise.id} promise={promise} user={user} />
      </LoadableContainer>
    );
  }
}

export default withRouter(PromiseView);
