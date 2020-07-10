import React, { FC, ReactNode } from 'react';
import { FormikErrors, FormikValues, FormikTouched, FormikHandlers } from 'formik';

// Components
import { Input as BaseInput } from 'ui/styled/antd/Input';
import { Item } from 'ui/styled/antd/Form';
import { HelpText } from 'ui/styled/HelpText';

type HandleChange = Pick<FormikHandlers, 'handleChange'>['handleChange'];

type InputProps = {
  name: string;
  errors?: FormikErrors<FormikValues>;
  placeholder: string;
  helpText?: string;
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
  helpText,
  size = 'large',
}) => (
  <Item
    className={className}
    help={touched?.[name] && errors?.[name]}
    label={label}
    validateStatus={touched?.[name] && errors?.[name] ? 'error' : ''}
  >
    <BaseInput
      name={name}
      onChange={handleChange}
      placeholder={placeholder}
      prefix={prefix}
      size={size}
      value={values[name] ? values[name] : undefined}
    />
    {helpText && <HelpText>{helpText}</HelpText>}
  </Item>
);

export default Input;
