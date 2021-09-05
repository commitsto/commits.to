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
    status: undefined,
  };

  public componentDidMount() {
    const {
      domain: { subdomain: username = '' } = {},
      location: { pathname: urtext = '' } = {}
    } = this.props;

    setTimeout(() => this.setState({ status: 'started' }), 0); // ensure it's visible

    fetch('/api/v1/promise/create', {
      body: JSON.stringify({ username, urtext }),
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
    }).then(({ ok }) => {
      if (ok) {
        this.setState({ status: 'completed' });
        window.location.replace(`//${window.location.host}${urtext}`);
      }
    });
  }

  public render() {
    const { status } = this.state;

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
        </div>
      </main>
    );
  }
}

export default withParsedDomain(Confirm);
