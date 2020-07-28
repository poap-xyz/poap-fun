import React, { FC } from 'react';
import moment from 'moment';
import styled from '@emotion/styled';
import { FormikValues, FormikHelpers, FormikTouched, FormikErrors } from 'formik';

// Components
import { Item } from 'ui/styled/antd/Form';
import { DatePicker as BaseDatePicker } from 'ui/styled/antd/DatePicker';

// Types
type SetFieldValue = Pick<FormikHelpers<FormikValues>, 'setFieldValue'>['setFieldValue'];

type DatePickerProps = {
  className?: string;
  name: string;
  placeholder: string;
  format?: string;
  values: FormikValues;
  setFieldValue: SetFieldValue;
  touched: FormikTouched<FormikValues>;
  errors?: FormikErrors<FormikValues>;
  label?: string;
  futureDates?: boolean;
};

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const DatePicker: FC<DatePickerProps> = ({
  className,
  setFieldValue,
  name,
  errors,
  placeholder,
  label,
  format = 'DD-MMM-YYYY',
  touched,
  values,
  futureDates = false,
}) => {
  const handleDateChange = (date: moment.Moment | null) => setFieldValue(name, date);

  const disabledPast = (current: moment.Moment) => {
    // Can not select days before today and today
    return current && current < moment().startOf('day');
  };

  const allowAll = (current: moment.Moment) => false;

  return (
    <Item
      className={className}
      help={touched?.[name] && errors?.[name]}
      label={label}
      validateStatus={touched?.[name] && errors?.[name] ? 'error' : ''}
    >
      <Content>
        <BaseDatePicker
          fullWidth={true}
          disabledDate={futureDates ? disabledPast : allowAll}
          name={name}
          placeholder={placeholder}
          format={format}
          value={values[name] ? values[name] : undefined}
          onChange={handleDateChange}
        />
      </Content>
    </Item>
  );
};

export default DatePicker;
