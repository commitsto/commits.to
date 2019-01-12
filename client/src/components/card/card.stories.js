import React from 'react';
import { host } from 'storybook-host';
import { storiesOf } from '@storybook/react';
import StoryRouter from 'storybook-react-router';

import Card from 'src/components/card';
import CardHeader from 'src/components/card/header';
import CardDetails from 'src/components/card/details';
import CardFooter from 'src/components/card/footer';

import { black } from 'lib/theme/colors';

const hostContainer = {
  align: 'middle',
  backdrop: black,
  width: '75vw',
};

const user = {
  username: 'testuser',
  score: .986437,
  counted: 68,
  pending: 1,
};

const promise = {
  id: 'testuser/this-is-a-test-promise',
  username: 'testuser',
  urtext: 'this-is-a-test-promise',
  credit: .98672,
  what: 'This is a test promise',
  note: 'some extra details about the promise go here',
  tdue: new Date(),
  // tfin: new Date(),
}

storiesOf('Card/Sections', module)
  .addDecorator(
    host(hostContainer),
  )
  .addDecorator(StoryRouter())
  .add('Header', () => (<CardHeader {...user} />))
  .add('Details', () => (<CardDetails {...promise} />))
  .add('Footer', () => (<CardFooter {...promise} />));

  storiesOf('Card', module)
  .addDecorator(
    host(hostContainer),
  )
  .addDecorator(StoryRouter())
  .add('Card', () => (<Card user={user} promise={promise} />));
