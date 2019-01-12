import _ from 'lodash';
import * as React from 'react';

import Card from 'src/components/card';
import LoadableContainer from 'src/components/loading/loadable';

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
          <Card key={promise.id} promise={promise} user={promise.user} />
        )) }
      </LoadableContainer>
    );
  }
}

export default Promise;
