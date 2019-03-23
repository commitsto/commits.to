import * as moment from 'moment';
import * as React from 'react';
import TimeKeeper from 'react-timekeeper';
import styled from 'styled-components';

const TimePickerWrapper = styled.div`
  flex: 1;
  margin-left: 2rem;
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
    </TimePickerWrapper>
  );
};

export default TimePicker;
