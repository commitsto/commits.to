import * as React from 'react';

const Confirm = () => (
  <main>
    <div className='auto-captcha'>
      <h2>
        Creating your promise...
    </h2>
      <p>
        Just give us a second to confirm that this is a legitimate request!
    </p>
      <div className='progress-bar-wrapper'>
        <div className='progress'>
          <div className='progress-bar' />
        </div>
      </div>
    </div>
  </main>
);

export default Confirm;
