import React from 'react';
import { host } from 'storybook-host';
import { storiesOf } from '@storybook/react';
import StoryRouter from 'storybook-react-router';

import Card from 'src/components/card';
import CardHeader from 'src/components/card/header';
import CardDetails from 'src/components/card/details';
import CardFooter from 'src/components/card/footer';

import { black } from 'src/theme/colors';

const user = {
  username: 'testuser',
  score: .986437,
  counted: 68,
  pending: 1,
};

const promise = {
  id: 'testuser/promise-urtext',
  username: 'testuser',
  urtext: 'promise-urtext',
  credit: .98672,
  // tfin: new Date(),
}

storiesOf('Card/Sections', module)
  .addDecorator(
    host({
      align: 'top',
      backdrop: black,
      width: '50vw',
    }),
  )
  .addDecorator(StoryRouter())
  .add('Header', () => (<CardHeader {...user} />))
  .add('Details', () => (<CardDetails {...user} />))
  .add('Footer', () => (<CardFooter promise={promise} />));

  storiesOf('Card', module)
  .addDecorator(
    host({
      align: 'top',
      backdrop: black,
      width: '50vw',
    }),
  )
  .addDecorator(StoryRouter())
  .add('Card', () => (<Card user={user} promise={promise} />));
