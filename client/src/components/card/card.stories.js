import React from 'react';
import { host } from 'storybook-host';
import { storiesOf } from '@storybook/react';
import StoryRouter from 'storybook-react-router';

import CardHeader from 'src/components/card/header';

import { black } from 'src/theme/colors';

const user = {
  username: 'testuser',
  score: .986437,
  counted: 68,
  pending: 1,
};

storiesOf('Card', module)
  .addDecorator(
    host({
      align: 'top',
      backdrop: black,
      width: '50vw',
    }),
  )
  .addDecorator(StoryRouter())
  .add('Header', () => (<CardHeader {...user} />));
