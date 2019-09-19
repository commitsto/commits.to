import { FieldAttributes, FormikActions } from 'formik';
import * as moment from 'moment';
import * as React from 'react';
import styled from 'styled-components';

import DayPicker from 'src/components/form/picker/day';
import TimePicker from 'src/components/form/picker/time';

const PickerRow = styled.div`
  display: flex;
  margin: .5rem 0 1.5rem;
`;

interface IDatePickerProps {
  field: FieldAttributes<string>;
  form: FormikActions<string>;
}

interface IDatePickerState {
  dayValue: string;
  rawValue: moment.Moment;
  timeValue: string;
}

class DatePicker extends React.Component<IDatePickerProps, IDatePickerState> {
  constructor(props) {
    super(props);

    const rawValue = this.props.field.value;
    this.state = {
      dayValue: rawValue && moment(rawValue).format('YYYY-MM-DD'),
      rawValue,
      timeValue: rawValue && moment(rawValue).format('hh:mm A'),
    };
  }

  public componentDidUpdate() {
    const { dayValue, rawValue, timeValue } = this.state;
    const { field: { name }, form } = this.props;

    const rawTime = moment(`${dayValue} ${timeValue}`);
    if (rawTime.isValid() && rawTime.valueOf() !== rawValue.valueOf()) {
      form.setFieldValue(name, rawTime);
      this.setState({ rawValue: rawTime });
    }
  }

  public changeTime = ({ target: { value } }) => this.setState({ timeValue: value });

  public changeDay = ({ target: { value } }) => this.setState({ dayValue: value });

  public render() {
    const { changeDay, changeTime } = this;
    const { dayValue, rawValue, timeValue } = this.state;

    return (
      <PickerRow>
        <DayPicker raw={rawValue} value={dayValue} onChange={changeDay} />
        <TimePicker raw={rawValue} value={timeValue} onChange={changeTime} />
      </PickerRow>
    );
  }
}

export default DatePicker;
