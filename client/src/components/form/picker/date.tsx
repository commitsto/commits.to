import * as React from 'react';
import styled from 'styled-components';

import DayPicker from 'src/components/form/picker/day';
import TimePicker from 'src/components/form/picker/time';

const PickerRow = styled.div`
  display: flex;
`;

interface IDatePickerProps {
  field: {}; // FIXME: formik types
}

class DatePicker extends React.Component<IDatePickerProps, {}> {
  public render() {
    const { field } = this.props;

    return (
      <PickerRow>
        <DayPicker field={field} />
        <TimePicker field={field} />
      </PickerRow>
    );
  }
}

export default DatePicker;
