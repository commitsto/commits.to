import _ from 'lodash';

// import { timeDiff } from 'lib/parse/time';

// import { isNewPromise } from 'server/models/promise';
const isNewPromise = ({ clix }) => clix === 1; // FIXME

// export const dueStatus = (dueDate) => {
//   if (!dueDate) { return ''; }

//   console.log('dueStatus', dueDate);
//   return timeDiff({ dueDate, units: 'hours' });
// };

// FIXME
export const selectedIfVoid = (promise) => {
  return promise.void ? 'selected="selected"' : '';
};

export const cardClassesFor = (promise) => {
  if (!promise) { return {}; }

  const classes = {
    completed: promise.tfin,
    new: isNewPromise(promise),
    voided: promise.void,
  };

  // console.log('cardClassesFor', promise, classes);
  return _(classes).pickBy().keys().value().join(' ');
};
