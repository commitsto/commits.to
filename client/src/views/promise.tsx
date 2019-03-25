import _ from 'lodash';
import * as React from 'react';
import { withRouter } from 'react-router-dom';

import DomainParser from 'lib/parse/domain';

import EditButton from 'src/components/button/edit';
import { IPromise } from 'src/components/card/index';
import LoadableContainer from 'src/components/loading/loadable';
import PromiseCard from 'src/components/promise/card';

interface IPromiseViewProps {
  location: { pathname?: string };
}

interface IPromiseViewState {
  promise?: IPromise;
}

class PromiseView extends React.Component<IPromiseViewProps, IPromiseViewState> {
  public readonly state: Readonly<IPromiseViewState> = {
    promise: {},
  };

  public componentDidMount() {
    const { location = {} } = this.props;
    const { pathname: urtext } = location;
    const username = DomainParser.getUsername(window.location.hostname);

    fetch(`/api/v1/promise/?username=${username}&urtext=${urtext.substr(1).toLowerCase()}`)
      .then((response) => {
        response.json()
          .then(({ promise }) => {
            this.setState({ promise });
          });
      });
  }

  public render() {
    const { location: { pathname = '' } = {} } = this.props;
    const { promise: { user, ...promise } } = this.state;

    return (
      <LoadableContainer isLoaded={!_.isEmpty(promise)}>
        <PromiseCard withHeader key={promise.id} promise={promise} user={user} />
        <EditButton href={`/edit${pathname}`}>
          EDIT
        </EditButton>
      </LoadableContainer>
    );
  }
}

export default withRouter(PromiseView);
