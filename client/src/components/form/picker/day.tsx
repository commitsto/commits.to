import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as moment from 'moment';
import * as React from 'react';
import styled from 'styled-components';

import { gray } from 'lib/theme/colors';

const DayPickerWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 2;
  margin-right: 2rem;

  input {
    margin-right: 1rem;
  }

  svg {
    color: ${gray}
  }
`;

interface IDayPickerProps {
  onChange: ({}) => void;
  raw: moment.Moment;
  showPicker?: boolean;
  toggleClick?: () => void;
  value: string;
}

const DayPicker: React.SFC<IDayPickerProps> = ({
  onChange, raw, showPicker, toggleClick, value
}) => {
  return (
    <DayPickerWrapper>
      <input type='text' onChange={onChange} value={value} />
      { showPicker &&
        <div>
          {/* FIXME */}
          { raw }
        </div>
      }
      <div onClick={toggleClick}>
        <FontAwesomeIcon icon='calendar-alt' size='2x' />
      </div>
    </DayPickerWrapper>
  );
};

export default DayPicker;
