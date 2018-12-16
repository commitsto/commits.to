import * as React from 'react';
import styled from 'styled-components';

import { headerBg, headerBorder } from 'src/theme/colors';

const DarkHeader = styled.header`
  background-color: ${headerBg};
  border-bottom: 1px ridge ${headerBorder};
  display: flex;
  align-items: center;
  padding: .5rem 2rem;

  // FIXME
  h1 {
    margin: 0 auto 0 0;
  }

  a.button {
    float: right;
    margin-left: 1.5rem;
  }
`;

interface IHeaderProps {
  link?: string;
  title: string;
  showNav?: boolean;
}

const Header: React.SFC<IHeaderProps> = ({ link, title, showNav }) => (
  <DarkHeader>
    <h1>
      <a href={link}>
        {title}
      </a>
    </h1>
    {showNav &&
      <nav>
        <a
          className='button'
          target='_blank'
          href='http://blog.beeminder.com/will'>
          blog post
        </a>
        <a
          className='button'
          target='_blank'
          href='https://github.com/beeminder/iwill'>
          github repo
        </a>
        <a
          className='button'
          target='_blank'
          href='https://github.com/beeminder/iwill/wiki'>
          spec
        </a>
      </nav>
    }
  </DarkHeader>
);

Header.defaultProps = {
  link: '//www.commits.to',
  showNav: true,
};

export default Header;
