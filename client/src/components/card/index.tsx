import * as React from 'react';

import CardDetails from 'src/components/card/details';
import CardFooter from 'src/components/card/footer';
import CardHeader from 'src/components/card/header';

// <div className='promise-card {{cardClassesFor promise}} {{dueColor (dueStatus promise.tdue)}}'>

const Card = () => (
  <section className='card'>
    <CardHeader />
    <CardDetails />
    <CardFooter />
  </section>
);

export default Card;
