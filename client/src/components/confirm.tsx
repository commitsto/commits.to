import { map } from 'lodash';
import React from 'react';

import ProgressBar from 'src/components/bar/progress';
import withParsedDomain from 'src/containers/with_parsed_domain';

// FIXME: share
interface IConfirmProps {
  domain: { subdomain: string; };
  location: { pathname?: string };
}

interface IConfirmState {
  status?: IProgress['status'];
  errors?: string[];
}

// const username = '{{username}}'
// const id = username + '{{urtext}}'
// fetchById({ action: 'validate', id, username }).then(function (response) {
//   if (response.status === 200) {
//     $('.progress-bar').addClass('complete')
//     location.reload(true)
//   } else {
//     $('.progress-bar').addClass('started')
//   }
// })

class Confirm extends React.Component<IConfirmProps, IConfirmState> {
  public readonly state: Readonly<IConfirmState> = {
    errors: undefined,
    status: undefined,
  };

  public componentDidMount() {
    const {
      domain: { subdomain: username = '' } = {},
      location: { pathname: urtext = '' } = {}
    } = this.props;

    // NB: ensure state change is visible when page is loading
    setTimeout(() => this.setState({ status: 'started' }), 0);

    fetch('/api/v1/promise/create', {
      body: JSON.stringify({ username, urtext }),
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
    })
      .then((response) => {
        if (response.ok) {
          this.setState({ status: 'completed' });
          return setTimeout(() => window.location.replace(`//${window.location.host}${urtext}`), 500);
        } else {
          return response.json();
        }
      })
      .then(({ errors }) => {
        return setTimeout(() => this.setState({ status: 'failed', errors }), 500);
      })
      .catch((...data) => {
        console.log('ERROR', data); // tslint:disable-line no-console
      });
  }

  public render() {
    const { status, errors } = this.state;

    return (
      <main>
        <div className='confirm'>
          <h2>
            Creating your promise...
          </h2>
          <p>
            Just give us a second to confirm that this is a legitimate request!
          </p>
          <ProgressBar status={status} />
          {status === 'failed' &&
            <div>
              <h4>Sorry, we couldn't create your promise for the following reason(s):</h4>
              <ul>
                {map(errors, (error) => (
                  <li>{error}</li>
                ))}
              </ul>
            </div>
          }
        </div>
      </main>
    );
  }
}

export default withParsedDomain(Confirm);
