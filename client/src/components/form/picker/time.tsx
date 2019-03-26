import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as moment from 'moment';
import * as React from 'react';
import TimeKeeper from 'react-timekeeper';
import styled from 'styled-components';

import { blue } from 'lib/theme/colors';

const TimePickerWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  margin-left: 2rem;

  input {
    margin-right: 1rem;
  }

  svg {
    color: ${blue}
  }
`;

interface ITimePickerProps {
  field: { value?: any }; // FIXME: formik types
  showPicker?: boolean;
}

const TimePicker: React.SFC<ITimePickerProps> = ({ field, showPicker }) => {
  const date = new Date(field.value);
  const time = {
    hour: date.getHours(),
    minute: date.getMinutes(),
  };

  const prettyTime = moment(date).format('hh:mm A');

  return (
    <TimePickerWrapper>
      <input type='text' {...field} value={prettyTime} />
      { showPicker &&
        <TimeKeeper time={time} />
      }
      <FontAwesomeIcon icon='clock' size='2x' />
    </TimePickerWrapper>
  );
};

export default TimePicker;
