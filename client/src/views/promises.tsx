import _ from 'lodash';
import * as React from 'react';

import Card from 'src/components/card';

class Promise extends React.Component {
  public state = {
    promises: [],
  };

  public componentDidMount() {
    fetch('http://commits-to.js:8080/api/v1/promises/incomplete')
      .then((response) => {
        response.json()
          .then(({ promises }) => {
            console.log('data', promises);
            this.setState({ promises });
          });
      });
  }

  public render() {
    const { promises } = this.state;
    return _.map(promises, (promise) => (
      <Card key={promise.id} promise={promise} user={promise.user} />
    ));
  }
}

export default Promise;
