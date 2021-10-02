import _ from 'lodash';
import React from 'react';

import Loader from 'src/components/loading/loader';

const LoadingIndicator = () => (
  <Loader>
    <div className='loading__indicator'>
      { _.times(6, (i) => (
        <div key={i} className='loading__bar'>
          <div className='left' />
          <div className='center' />
          <div className='right' />
          <div className='bottom' />
          <div className='shadow' />
        </div>
      ))}
    </div>
  </Loader>
);

export default LoadingIndicator;
