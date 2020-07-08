import React, { FC, ReactNode } from 'react';
import { FormikErrors, FormikValues, FormikTouched, FormikHandlers } from 'formik';

// ui components
import { Input as BaseInput } from 'ui/styled/antd/Input';
import { Item } from 'ui/styled/antd/Form';

type HandleChange = Pick<FormikHandlers, 'handleChange'>['handleChange'];

type InputProps = {
  name: string;
  errors?: FormikErrors<FormikValues>;
  placeholder: string;
  touched: FormikTouched<FormikValues>;
  values: FormikValues;
  label: string;
  handleChange: HandleChange;
  prefix?: ReactNode;
  className?: string;
  size?: 'large' | 'small';
};

const Input: FC<InputProps> = ({
  className,
  touched,
  errors,
  handleChange,
  name,
  label,
  values,
  prefix,
  placeholder,
  size = 'large',
}) => (
  <Item
    className={className}
    data-cy={`${name}-item`}
    help={touched?.[name] && errors?.[name]}
    label={label}
    validateStatus={touched?.[name] && errors?.[name] ? 'error' : ''}
  >
    <BaseInput
      data-cy={name}
      name={name}
      onChange={handleChange}
      placeholder={placeholder}
      prefix={prefix}
      size={size}
      value={values[name] ? values[name] : undefined}
    />
  </Item>
);

export default Input;
