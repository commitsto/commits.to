import _ from 'lodash';
import * as React from 'react';

import LoadableContainer from 'src/components/loading/loadable';
import PromiseCard from 'src/components/promise/card';

class Promise extends React.Component {
  public state = {
    promises: [],
  };

  public componentDidMount() {
    fetch('/api/v1/promise/incomplete')
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
          <PromiseCard withHeader key={promise.id} promise={promise} user={promise.user} />
        )) }
      </LoadableContainer>
    );
  }
}

export default Promise;
