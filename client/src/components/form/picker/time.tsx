import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as moment from 'moment';
import * as React from 'react';
import TimeKeeper from 'react-timekeeper';
import styled from 'styled-components';

import { gray } from 'lib/theme/colors';

const TimePickerWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  margin-left: 2rem;

  input {
    margin-right: 1rem;
  }

  svg {
    color: ${gray}
  }
`;

interface ITimePickerProps {
  onChange: ({}) => void;
  raw: moment.Moment;
  showPicker?: boolean;
  toggleClick?: () => void;
  value: string;
}

const TimePicker: React.SFC<ITimePickerProps> = ({
  onChange, raw, showPicker, toggleClick, value
}) => {
  return (
    <TimePickerWrapper>
      <input type='text' onChange={onChange} value={value} />
      { showPicker &&
        <TimeKeeper time={raw} />
      }
      <div onClick={toggleClick}>
        <FontAwesomeIcon icon='clock' size='2x' />
      </div>
    </TimePickerWrapper>
  );
};

export default TimePicker;
