import React, { FC } from 'react';
import styled from '@emotion/styled';
import { FormikValues, FormikHelpers, FormikTouched, FormikHandlers, FormikErrors } from 'formik';

// Components
import { Item } from 'ui/styled/antd/Form';
import { DatePicker as BaseDatePicker } from 'ui/styled/antd/DatePicker';

// Types
// type SetFieldValue = Pick<FormikHelpers<FormikValues>, 'setFieldValue'>['setFieldValue'];
// type ValidateForm = Pick<FormikHelpers<FormikValues>, 'validateForm'>['validateForm'];
type HandleChange = Pick<FormikHandlers, 'handleChange'>['handleChange'];

type DatePickerProps = {
  className?: string;
  name: string;
  format?: string;
  values: FormikValues;
  touched: FormikTouched<FormikValues>;
  errors?: FormikErrors<FormikValues>;
  label?: string;
  handleChange: HandleChange;
};

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const DatePicker: FC<DatePickerProps> = ({
  className,
  handleChange,
  name,
  errors,
  label,
  format = 'DD-MMM-YYYY',
  touched,
  values,
}) => (
  <Item
    className={className}
    help={touched?.[name] && errors?.[name]}
    label={label}
    validateStatus={touched?.[name] && errors?.[name] ? 'error' : ''}
  >
    <Content>
      <BaseDatePicker
        name={name}
        format={format}
        value={values[name] ? values[name] : undefined}
        onChange={handleChange}
      />
    </Content>
  </Item>
);

export default DatePicker;
