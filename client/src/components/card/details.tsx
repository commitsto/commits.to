import * as React from 'react';

import { prettyDate, relativeDate } from 'lib/helpers/format';
import { promisePath } from 'lib/helpers/path';

const CardDetails = ({ what, note, tdue, username, urtext }) => (
  <div>
    <div className='promise-info'>
      <div className='promise-details'>
        <a href={promisePath({ username, urtext })}>
          <div className='promise-domain'>
            commits.to
          </div>
          <div className='promise-text'>
            {{ what }}
          </div>
          { note &&
            <small>
              { note }
            </small>
          }
        </a>
      </div>
    </div>

    { tdue &&
      <div className='promise-bar promise-bar--due'>
        <div className='promise-bar-date" style="opacity:.75'>
          <div className='relative-date'>
            { relativeDate(tdue) }
          </div>
          <div className='momentable" data-date="{{tdue}}'>
            <span><noscript>{ prettyDate(tdue) }</noscript></span>
          </div>
        </div>
      </div>
    }
  </div>
);

export default CardDetails;
