import React from 'react';
import styled from 'styled-components';

import { green, red, yellow } from 'lib/theme/colors';

const ProgressContainer = styled.div`
  padding: 10px;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 6px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.25), 0 1px rgba(255, 255, 255, 0.08);
`;

const ProgressBarWrapper = styled.div`
  margin: 3rem 0;
`;

const ProgressBarStyled = styled.div`
  background-color: ${ ({ status }) => status === 'started' && yellow || status === 'completed' && green || red};
  height: 16px;
  border-radius: 4px;
  transition: 0.25s ease-in;
  transition-property: width, background-color;
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.25), inset 0 1px rgba(255, 255, 255, 0.1);
  width: ${ ({ status }) => status === 'started' && 80 || status === 'completed' && 100 || 1}%;
`;

const ProgressBar: React.SFC<IProgress> = ({ status }) => (
  <ProgressBarWrapper>
    <ProgressContainer>
      <ProgressBarStyled status={status} />
    </ProgressContainer>
  </ProgressBarWrapper>
);

export default ProgressBar;
