import * as React from 'react';

import LoadingIndicator from 'src/components/loading/indicator';

const LoadableContainer = ({ children, isLoaded }) => {
  if (!isLoaded) {
    return <LoadingIndicator />;
  }

  return children;
};

export default LoadableContainer;
