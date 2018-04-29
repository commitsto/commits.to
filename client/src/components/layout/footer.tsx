import * as React from 'react'

const Header: React.SFC<any> = ({}) => (
  <footer>
    <small>
      Brought to you by the
      <a
        target="_blank"
        href="https://www.beeminder.com"
        title="Reminders with a sting">
        Beeminder
      </a>
      team and
      <a
        target="_blank"
        href="http://chrisbutler.me">
        Chris Butler
      </a>.
      <span style={{ float: 'right' }}>&copy; 2017&ndash;2018</span>
    </small>
  </footer>
);

export default Header;
