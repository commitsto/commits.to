import * as React from 'react';

const Intro: React.SFC<{}> = () => (
  <div className='intro'>
    <h3 className='sub-heading'>
      a.k.a. The I-Will System
    </h3>
    <p>
      Create a commitment by constructing a URL like "<b>alice.commits.to/send_the_report</b>" and just by clicking on such a URL, a commitment is logged here.
    </p>
  </div>
);

export default Intro;
