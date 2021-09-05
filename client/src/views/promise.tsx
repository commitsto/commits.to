import _ from 'lodash';
import React from 'react';

import EditButton from 'src/components/button/edit';
import Confirm from 'src/components/confirm';
import LoadableContainer from 'src/components/loading/loadable';
import PromiseCard from 'src/components/promise/card';
import withParsedDomain from 'src/containers/with_parsed_domain';
import PromiseEditForm from 'src/views/edit';

// FIXME: share
interface IPromiseViewProps {
  domain: { subdomain: string; };
  location: { pathname?: string };
}

interface IPromiseViewState {
  isEditing: boolean;
  promise?: IPledge;
}

class PromiseView extends React.Component<IPromiseViewProps, IPromiseViewState> {
  public readonly state: Readonly<IPromiseViewState> = {
    isEditing: false,
    promise: undefined,
  };

  public constructor(props) {
    super(props);

    const { data } = props;
    this.state = {
      ...this.state,
      promise: data
    };
  }

  public componentDidMount() {
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

  public setEditing = (e) => {
    e.preventDefault();
    this.setState({ isEditing: true });
  }

  public clearEditing = (values) => {
    const promise = { ...this.state.promise, ...values };
    this.setState({ promise, isEditing: false });
  }

  public render() {
    if (this.state.promise === null) {
      return <Confirm />;
    }

    const { setEditing, clearEditing } = this;
    const { location: { pathname = '' } = {} } = this.props;
    const { isEditing, promise: { user = {} } = {}, promise = {} } = this.state;

    return (
      <LoadableContainer isLoaded={!_.isEmpty(promise)}>
        <PromiseCard withHeader promise={promise} user={user} />
        {!isEditing &&
          <EditButton href='#' onClick={setEditing}>
            EDIT
          </EditButton>
        }
        {isEditing &&
          <PromiseEditForm promise={promise} onSubmit={clearEditing} />
        }
      </LoadableContainer>
    );
  }
}

export default withParsedDomain(PromiseView);
