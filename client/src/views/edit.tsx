import _ from 'lodash';
import * as React from 'react';
import { withRouter } from 'react-router-dom';

import { IPromise } from 'src/components/card/index';
import LoadableContainer from 'src/components/loading/loadable';
import PromiseCard from 'src/components/promise/card';

// FIXME method on Promise model
const parseId = ({ id = '' }) => {
  const [ , username, ...urtext ] = id.toLowerCase().split('/');
  return { username, urtext: urtext.join('/') };
};

interface IPromiseEditProps {
  location: { pathname?: string };
}

interface IPromiseEditState {
  promise?: IPromise;
}

class PromiseEdit extends React.Component<IPromiseEditProps, IPromiseEditState> {
  public readonly state: Readonly<IPromiseEditState> = {
    promise: {},
  };

  public componentDidMount() {
    const { location = {} } = this.props;
    const { pathname } = location;
    const { username, urtext } = parseId({ id: pathname.substring(5) }); // remove /edit

    fetch(`/api/v1/promise/?username=${username}&urtext=${urtext}`)
      .then((response) => {
        response.json()
          .then(({ promise = {} }) => {
            this.setState({ promise });
          });
      });
  }

  public render() {
    const { promise: { user = {}, ...promise } = {} } = this.state;
    return (
      <LoadableContainer isLoaded={!_.isEmpty(promise)}>
        <PromiseCard withHeader key={promise.id} promise={promise} user={user} />
      </LoadableContainer>
    );
  }
}

export default withRouter(PromiseEdit);
