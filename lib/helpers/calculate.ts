import _ from 'lodash';

import { timeDiff } from 'lib/parse/time';
// import { isNewPromise } from 'server/models/promise';
const isNewPromise = ({ promise }) => promise.clix === 1; // FIXME

export const dueStatus = (dueDate) => {
  if (!dueDate) { return ''; }

  console.log('dueStatus', dueDate);
  return timeDiff({ dueDate, units: 'hours' });
};

// FIXME
export const selectedIfVoid = (promise) => {
  return promise.void ? 'selected="selected"' : '';
};

export const cardClassesFor = (promise) => {
  if (!promise) { return {}; }

  const classes = _({
    completed: promise.tfin,
    new: isNewPromise({ promise }),
    voided: promise.void,
  })
    .pickBy()
    .keys()
    .join(' ');

  console.log('cardClassesFor', promise.id, classes);
  return classes;
};
