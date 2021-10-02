import React from 'react';
import styled from 'styled-components';

import Card from 'src/components/card';

const PromiseCardFlex = styled.div`
  flex: 1 1 auto;
  margin: .5rem;
`;

const PromiseCard = (props) => (
  <PromiseCardFlex>
    <Card {...props} />
  </PromiseCardFlex>
);

export default PromiseCard;
