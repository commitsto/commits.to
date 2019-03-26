// import * as moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import styled from 'styled-components';

import { blue } from 'lib/theme/colors';

const DayPickerWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 2;
  margin-right: 2rem;

  input {
    margin-right: 1rem;
  }

  svg {
    color: ${blue}
  }
`;

interface IDayPickerProps {
  field: { value?: any }; // FIXME: formik types
  showPicker?: boolean;
}

const DayPicker: React.SFC<IDayPickerProps> = ({ field, showPicker }) => {
  const date = new Date(field.value);

  return (
    <DayPickerWrapper>
      <input type='text' {...field} />
      {showPicker &&
        <div />
      }
      <FontAwesomeIcon icon='calendar-alt' size='2x' />
    </DayPickerWrapper>
  );
};

export default DayPicker;
