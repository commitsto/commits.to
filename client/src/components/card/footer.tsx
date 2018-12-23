import * as React from 'react';
import styled from 'styled-components';

import { completeCredit } from 'lib/helpers/format';

import CreditBar from 'src/components/bar/credit';
import { black, grayBlue, headerBorder, lightGray, white } from 'src/theme/colors';

const FooterWrapper = styled.div`
  background: ${black};
  border: 1px solid ${headerBorder};
  border-top: none;
`;

const BarLink = styled.a`
  color: ${white};
  text-decoration: none;
  text-transform: uppercase;
      transition: .35s ease-in;
      white-space: nowrap;
`;

const FooterLink = styled.a`
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
  completePromise: ({ }) => void;
  promise: {
    credit?: number;
    id: string;
    tfin?: Date;
    urtext: string;
    username: string;
  };
}

const CardFooter: React.SFC<ICardFooterProps> = ({
  completePromise, promise
}) => (
  <FooterWrapper>
    <FooterPromiseBar>
      <CreditBar promise={promise}>
        <BarLink href='#'
          onClick={completePromise({ username: promise.username, id: promise.id })}
          title={`Mark ${completeCredit(promise.credit)} Complete`}>
          <span>Mark {completeCredit(promise.credit)} Complete</span>
        </BarLink>
      </CreditBar>
    </FooterPromiseBar>
    <PromiseSlug>
      <FooterLink href='{{promisePath promise}}'>
        { promise.urtext }
      </FooterLink>
    </PromiseSlug>
  </FooterWrapper>
);

CardFooter.defaultProps = {
  completePromise: () => ({}),
};

export default CardFooter;
