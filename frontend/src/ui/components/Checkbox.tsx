import React, { FC } from 'react';
import styled from '@emotion/styled';
import { FormikValues, FormikHandlers } from 'formik';

// Components
import { Checkbox as BaseCheckbox } from 'ui/styled/antd/Checkbox';
import { Item } from 'ui/styled/antd/Form';
import { HelpText } from 'ui/styled/HelpText';

// Types
type HandleChange = Pick<FormikHandlers, 'handleChange'>['handleChange'];

type CheckboxProps = {
  className?: string;
  name: string;
  values: FormikValues;
  label?: string;
  handleChange: HandleChange;
  sideText: string;
  helpText?: string;
};

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const Checkbox: FC<CheckboxProps> = ({ className, handleChange, name, label, sideText, values, helpText }) => (
  <Item className={className} label={label} valuePropName="checked">
    <Content>
      <BaseCheckbox checked={values[name] ? values[name] : undefined} name={name} onChange={handleChange}>
        {sideText}
      </BaseCheckbox>
    </Content>
    {helpText && <HelpText>{helpText}</HelpText>}
  </Item>
);

export default Checkbox;
