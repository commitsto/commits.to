import * as React from 'react'

interface IHeaderProps {
  link?: string;
  title: string;
  showNav?: boolean;
}

const Header: React.SFC<IHeaderProps> = ({ link, title, showNav }) => (
  <header>
    <h1>
      <a href={link}>
        { title }
      </a>
    </h1>
    { showNav &&
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
  </header>
);

Header.defaultProps = {
  link: '//www.commits.to',
  showNav: true,
};

export default Header;
