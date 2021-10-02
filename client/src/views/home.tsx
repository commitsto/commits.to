import React from 'react';
import styled from 'styled-components';

import Intro from 'src/components/intro';
import Promises from 'src/views/promises';

const PromisesPreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 2rem -.5rem 0;
`;

const Home = () => (
  <section className='home'>
    <Intro />
    <PromisesPreview>
      <Promises />
    </PromisesPreview>
  </section>
);

export default Home;
