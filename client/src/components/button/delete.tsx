import styled from 'styled-components'

import { red } from 'lib/theme/colors'

const DeleteButton = styled.a`
  font-size: 12px;
  margin-left: .5rem; // FIXME

  &:hover {
    color: ${red};
  }
`

export default DeleteButton
