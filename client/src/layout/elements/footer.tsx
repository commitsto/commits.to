import * as React from 'react';
import styled from 'styled-components';

import { gray, white } from 'lib/theme/colors';

const DarkFooter = styled.footer`
  color: ${white};
  margin-top: 1rem;
  padding: 2rem;
  border-top: 1px solid ${gray};
`;

const Footer: React.SFC<any> = ({}) => (
  <DarkFooter>
    <small>
      Brought to you by the&nbsp;
      <a target="_blank" href="https://www.beeminder.com" title="Reminders with a sting">
        Beeminder&nbsp;
      </a>
      team and&nbsp;
      <a target="_blank" href="http://chrisbutler.me">
        Chris Butler
      </a>.
      <span style={{ float: 'right' }}>
        &copy; 2017&ndash;2019
      </span>
    </small>
  </DarkFooter>
);

export default Footer;
