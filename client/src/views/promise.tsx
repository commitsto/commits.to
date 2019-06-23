import _ from 'lodash';
import * as React from 'react';

import EditButton from 'src/components/button/edit';
import Confirm from 'src/components/confirm';
import LoadableContainer from 'src/components/loading/loadable';
import PromiseCard from 'src/components/promise/card';
import withParsedDomain from 'src/containers/with_parsed_domain';

// FIXME: share
interface IPromiseViewProps {
  domain: { subdomain: string; };
  location: { pathname?: string };
}

interface IPromiseViewState {
  promise?: IPledge;
}

class PromiseView extends React.Component<IPromiseViewProps, IPromiseViewState> {
  public readonly state: Readonly<IPromiseViewState> = {
    promise: undefined,
  };

  public constructor(props) {
    super(props);

    const { data } = props;
    this.state = {
      promise: data
    };
  }

  public componentDidMount() {
    // console.log('DID MOUNT')
    if (this.state.promise) {
      return;
    }

    const {
      domain: { subdomain: username = '' } = {},
      location: { pathname: urtext = '' } = {}
    } = this.props;

    fetch(`/api/v1/promise/?username=${username}&urtext=${urtext.substr(1).toLowerCase()}`)
      .then((response) => {
        response.json()
          .then(({ promise }) => {
            console.log('fetch', username, promise); // tslint:disable-line
            // FIXME: null
            // if (promise != null) {
            this.setState({ promise });
            // }
          });
      });
  }

  public render() {
    if (this.state.promise === null) {
      return <Confirm />;
    }

    const { location: { pathname = '' } = {} } = this.props;
    const { promise: { user = {} } = {}, promise = {} } = this.state;

    return (
      <LoadableContainer isLoaded={!_.isEmpty(promise)}>
        <PromiseCard withHeader promise={promise} user={user} />
        <EditButton href={`/edit${pathname}`}>
          EDIT
        </EditButton>
      </LoadableContainer>
    );
  }
}

export default withParsedDomain(PromiseView);
