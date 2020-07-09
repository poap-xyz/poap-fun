import React, { FC } from 'react';
import moment from 'moment';
import styled from '@emotion/styled';
import { FormikValues, FormikHelpers, FormikTouched, FormikErrors } from 'formik';

// Components
import { Item } from 'ui/styled/antd/Form';
import { TimePicker as BaseTimePicker } from 'ui/styled/antd/TimePicker';

// Types
type SetFieldValue = Pick<FormikHelpers<FormikValues>, 'setFieldValue'>['setFieldValue'];

type TimePickerProps = {
  className?: string;
  name: string;
  placeholder: string;
  format?: string;
  values: FormikValues;
  setFieldValue: SetFieldValue;
  touched: FormikTouched<FormikValues>;
  errors?: FormikErrors<FormikValues>;
  label?: string | React.ReactNode;
  futureDates?: boolean;
};

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const TimePicker: FC<TimePickerProps> = ({
  className,
  setFieldValue,
  name,
  errors,
  placeholder,
  label,
  format = 'HH:mm',
  touched,
  values,
}) => {
  const handleTimeChange = (time: moment.Moment | null) => setFieldValue(name, time);
  return (
    <Item
      className={className}
      help={touched?.[name] && errors?.[name]}
      label={label}
      validateStatus={touched?.[name] && errors?.[name] ? 'error' : ''}
    >
      <Content>
        <BaseTimePicker
          fullWidth={true}
          name={name}
          placeholder={placeholder}
          format={format}
          value={values[name] ? values[name] : undefined}
          onChange={handleTimeChange}
        />
      </Content>
    </Item>
  );
};

export default TimePicker;
