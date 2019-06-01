import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import withParsedDomain from 'src/containers/with_parsed_domain';

import { completeCredit, prettyCredit } from 'lib/helpers/format';
import { promisePath } from 'lib/helpers/path';
import { black, grayBlue, headerBorder, lightGray, white } from 'lib/theme/colors';

import CreditBar from 'src/components/bar/credit';

const FooterWrapper = styled.div`
  background: ${black};
  border: 1px solid ${headerBorder};
  border-top: none;
  flex-basis: 100%;
`;

const BarLink = styled.a`
  color: ${white};
  text-decoration: none;
  text-transform: uppercase;
  transition: .35s ease-in;
  white-space: nowrap;
`;

const FooterLink = styled(Link)`
  color: ${lightGray};
  text-decoration: none;
`;

const FooterPromiseBar = styled.div`
  background: ${grayBlue};
`;

const PromiseSlug = styled.div`
  border-top: 1px solid ${headerBorder};
  font-size: .75rem;
  font-weight: 300;
  letter-spacing: 1px;
  margin-right: auto;
  opacity: .75;
  padding: .4rem 1rem;
  word-break: break-all;
  z-index: 1;
`;

interface ICardFooterProps {
  completePromise?: ({ }) => void;
  credit?: number;
  domain: { root?: string };
  id: string;
  tfin?: Date;
  urtext: string;
  username: string;
}

const CardFooter: React.SFC<ICardFooterProps> = ({
  completePromise, credit, domain: { root: host = '' } = {}, id, tfin, urtext, username,
}) => (
  <FooterWrapper>
    <FooterPromiseBar>
      <CreditBar credit={credit}>
        { tfin ?
            <span>{ prettyCredit(credit) }</span>
          :
          <BarLink href='#' onClick={completePromise({ username, id })}>
            <span>Mark {completeCredit(credit)} Complete</span>
          </BarLink>
        }
      </CreditBar>
    </FooterPromiseBar>
    <PromiseSlug>
      <FooterLink to={promisePath({ host, username, urtext })}>
        { urtext }
      </FooterLink>
    </PromiseSlug>
  </FooterWrapper>
);

CardFooter.defaultProps = {
  completePromise: () => ({}),
};

export default withParsedDomain(CardFooter);
