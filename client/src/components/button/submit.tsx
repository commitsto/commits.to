import { darken } from 'polished'
import styled from 'styled-components'

import { blue, white } from 'lib/theme/colors'

const SubmitButton = styled.button`
  color: ${white};
  cursor: pointer;
  background-color: ${blue};
  position: absolute;
  bottom: 0;
  display: block;
  font-size: 2rem;
  font-weight: bold;
  text-transform: uppercase;
  padding: 1rem;
  text-align: center;
  transition: all .25s ease-in-out;
  margin: 0;
  outline: 0;
  border: 0;
  border-radius: 0;
  width: 100%;
  left: 0;

  &:hover {
    background-color: ${darken(0.2, blue)};
  }
`

export default SubmitButton
