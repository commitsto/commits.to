import * as React from 'react';

const CardFooter = () => (
  <div className='promise-footer'>
    <div className='promise-bar-wrapper'>
      <div style='width: {{completeCredit promise.credit}}' >
        { !promise.tfin &&
          <div className='promise-bar promise-bar--bottom'>
            <div className='bar-button-action'>
              { user &&
                <a href='#'
                  className='promise-bar-link {{dueColor (dueStatus promise.tdue)}}'
                  onclick='completePromise('{{user.username}}', '{{promise.id}}')'
                  title='Mark {{completeCredit promise.credit}} Complete'>
                  <span>Mark { completeCredit promise.credit } Complete</span>
                </a>
              }
            </div>
          </div>
        }
        { promise.tfin &&
          <div className='credit--status {{creditColor promise.credit}}'>
            <span className='promise-credit'>{ prettyCredit promise.credit }</span>
          </div>
        }
      </div>
    </div>
    <div className='promise-slug'>
      <a href='{{promisePath promise}}'>
        { promise.urtext }
      </a>
    </div>
  </div>
);

export default CardFooter;
