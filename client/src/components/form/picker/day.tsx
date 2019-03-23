// import * as moment from 'moment';
import * as React from 'react';

import styled from 'styled-components';

const DayPickerWrapper = styled.div`
  flex: 2;
  margin-right: 2rem;
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
    </DayPickerWrapper>
  );
};

export default DayPicker;
