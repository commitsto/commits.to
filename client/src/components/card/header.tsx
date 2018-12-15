import * as React from 'react';

const CardHeader = () => (
  <div className='promise-header'>
    <h2 className='promise-user'>
      <a href='{userPath user}'>
        { promise.user.username }
      </a>
    </h2>
    <div className='promise-user-score {scoreColor promise.user.score}'>
      <span>{ prettyPercent promise.user.score 2}</span>
    </div>
    <div className='counted-promises'>
      { promise.user.counted }
      <span className='pending' >[+{ promise.user.pending }]</span>
    </div>
  </div>
);

export default CardHeader;
