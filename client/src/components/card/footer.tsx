import * as React from 'react';
import styled from 'styled-components';

import CreditBar from 'src/components/bar/credit';
import { black, grayBlue, headerBorder, lightGray } from 'src/theme/colors';

const FooterWrapper = styled.div`
  background: ${black};
  border: 1px solid ${headerBorder};
  border-top: none;
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
      <CreditBar promise={promise} completePromise={completePromise} />
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
