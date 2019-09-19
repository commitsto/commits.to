import _ from 'lodash';

// import { timeDiff } from 'lib/parse/time';

// import { isNewPromise } from 'server/models/promise';
const isNewPromise = ({ clix }) => clix === 1; // FIXME

// export const dueStatus = (dueDate) => {
//   if (!dueDate) { return ''; }

//   console.log('dueStatus', dueDate);
//   return timeDiff({ dueDate, units: 'hours' });
// };

// FIXME remove
export const selectedIfVoid = (promise) => {
  return promise.void ? 'selected="selected"' : '';
};

// FIXME void -> voided
export const cardClassesFor = ({ tfin, clix, voided = false }) => {
  const classes = {
    completed: tfin,
    new: isNewPromise({ clix }),
    voided,
  };

  // console.log('cardClassesFor', promise, classes);
  return _(classes).pickBy().keys().value().join(' ');
};
