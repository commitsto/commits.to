import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { grayBlue, white } from 'src/theme/colors';

const StyledLink = styled(Link)`
  color: ${white};
  text-decoration: none;
`;

export default StyledLink;
