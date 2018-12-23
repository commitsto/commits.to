import * as React from 'react';
import styled from 'styled-components';

import { creditColor } from 'lib/helpers/colors';
import { completeCredit } from 'lib/helpers/format';

import { white } from 'src/theme/colors';

const ColoredBar = styled.div`
  background: ${({ credit }) => creditColor(credit)};
  box-sizing: border-box;
  color: ${white};
  font-size: .85rem;
  font-weight: normal;
  letter-spacing: .25px;
  opacity: .8;
  padding: .5rem 1rem;
  position: relative;
  text-align: right;
  transition: background .35s ease-in;
  width: ${({ credit }) => completeCredit(credit)};
  z-index: 1;

  &:after {
    background: linear-gradient(to bottom, #0000007a -15%, #0000);
    content: '';
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: -1;
  }

  &:hover {
    background: ${white};
  }
`;

interface ICreditBarProps {
  children?: JSX.Element;
  credit: number;
}

const CreditBar: React.SFC<ICreditBarProps> = ({ children, credit }) => (
  <ColoredBar credit={credit}>
    { children }
  </ColoredBar>
);

export default CreditBar;
