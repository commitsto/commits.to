import _ from 'lodash'
import React from 'react'

import LoadableContainer from 'src/components/loading/loadable'
import PromiseCard from 'src/components/promise/card'
import withParsedDomain from 'src/containers/with_parsed_domain'

class Pledges extends React.Component {
  public state = {
    promises: []
  }

  public constructor (props) {
    super(props)

    const { data } = props
    this.state = {
      promises: data
    }
  }

  public componentDidMount () {
    fetch('/api/v1/promise/incomplete')
      .then((response) => {
        response.json()
          .then(({ promises }) => {
            // console.log('data', promises);
            this.setState({ promises })
          })
      })
  }

  public render () {
    const { promises } = this.state

    return (
      <LoadableContainer isLoaded={!(promises.length === 0)}>
        { _.map(promises, (promise) => (
          <PromiseCard withHeader key={promise.id} promise={promise} user={promise.user} />
        )) }
      </LoadableContainer>
    )
  }
}

export default withParsedDomain(Pledges)
