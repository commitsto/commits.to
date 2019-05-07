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
  staticContext: { promise: any; }; // FIXME Pledge: { id: string; user: {}; };
}

interface IPromiseViewState {
  promise?: IPromise;
}

class PromiseView extends React.Component<IPromiseViewProps, IPromiseViewState> {
  public readonly state: Readonly<IPromiseViewState> = {
    promise: undefined,
  };

  public componentDidMount() {
    const { location: { pathname: urtext = '' } = {} } = this.props;
    const username = DomainParser.getUsername(window.location.hostname);

    fetch(`/api/v1/promise/?username=${username}&urtext=${urtext.substr(1).toLowerCase()}`)
      .then((response) => {
        response.json()
          .then(({ promise }) => {
            // console.log('mount', username, promise)
            this.setState({ promise });
          });
      });
  }

  public render() {
    const { location: { pathname = '' } = {}, staticContext: { promise: propsPromise = {} } = {} } = this.props;
    const { promise: statePromise } = this.state;

    const promise = statePromise || propsPromise;

    // console.log('PROMISE!', promise, propsPromise)

    return (
      <LoadableContainer isLoaded={!_.isEmpty(promise)}>
        <PromiseCard withHeader key={promise.id} promise={promise} user={promise.user} />
        <EditButton href={`/edit${pathname}`}>
          EDIT
        </EditButton>
      </LoadableContainer>
    );
  }
}

export default withRouter(PromiseView);
