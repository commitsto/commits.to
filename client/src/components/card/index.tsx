import * as React from 'react';

import CardDetails from 'src/components/card/details';
import CardFooter from 'src/components/card/footer';
import CardHeader from 'src/components/card/header';

// <div className='promise-card {{cardClassesFor promise}} {{dueColor (dueStatus promise.tdue)}}'>
// .promise-card {
//   border-color: $white-gray;
//   opacity: 1;
// }
// transition: border .5s ease-out, opacity .3s ease-in-out;

const Card = ({ user, promise }) => (
  <section className='card'>
    <CardHeader {...user} />
    <CardDetails />
    <CardFooter promise={promise} />
  </section>
);

export default Card;
