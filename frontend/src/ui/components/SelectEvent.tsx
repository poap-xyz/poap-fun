import React, { FC, ReactNode } from 'react';
import styled from '@emotion/styled';
import { SelectValue } from 'antd/lib/select';
import { FormikErrors, FormikTouched, FormikValues, FormikHelpers } from 'formik';

// Components
import { Select as BaseSelect, Option } from 'ui/styled/antd/Select';
import { Item } from 'ui/styled/antd/Form';

// Helpers
import { transformEventDictionary } from 'lib/helpers/api';

// Types
import { PoapEvent, PoapEventDictionary } from 'lib/types';
type SetFieldValue = Pick<FormikHelpers<FormikValues>, 'setFieldValue'>['setFieldValue'];

type SelectProps = {
  name: string;
  errors?: FormikErrors<FormikValues>;
  placeholder: string;
  touched: FormikTouched<FormikValues>;
  values: FormikValues;
  setFieldValue: SetFieldValue;
  options: PoapEvent[] | undefined;
  prefix?: ReactNode;
  label: string;
  className?: string;
  size?: 'large' | 'small';
};

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  white-space: pre-wrap;

  .content {
    img {
      width: 40px;
      height: 40px;
      border-radius: 40px;
      margin: 5px;
      object-fit: cover;
    }
    &.event-data {
      width: 100%;
      display: flex;
      padding-left: 20px;
      flex-direction: column;
      .name {
        color: var(--primary-color);
        font-size: 14px;
        line-height: 14px;
      }
      .extra-data {
        font-size: 12px;
        line-height: 14px;
        color: var(--input-color);
      }
    }
  }
`;

const SelectEvent: FC<SelectProps> = ({
  className,
  touched,
  errors,
  name,
  values,
  options,
  label,
  placeholder,
  setFieldValue,
  size = 'large',
}) => {
  const events: PoapEventDictionary = options ? transformEventDictionary(options) : {};
  const handleSelectChange = (value: SelectValue) => setFieldValue(name, value);

  const filterOption = (inputValue: any, option: any) => {
    if (option && option.value && events[parseInt(option.value)]) {
      return events[parseInt(option.value)].name.toLowerCase().includes(inputValue.toLowerCase());
    }
    return false;
  };

  return (
    <Item
      className={className}
      help={touched?.[name] && errors?.[name]}
      label={label}
      validateStatus={touched?.[name] && errors?.[name] ? 'error' : ''}
    >
      <BaseSelect
        data-cy={name}
        onChange={handleSelectChange}
        placeholder={placeholder}
        size={size}
        mode={'multiple'}
        filterOption={filterOption}
        value={values[name] ? values[name] : undefined}
        listHeight={550}
      >
        {options &&
          options.map((option: any) => {
            let extraData: string | null = null;
            if (option.virtual_event) {
              extraData = 'Virtual event';
            } else {
              if (option.city && option.country) {
                extraData = `${option.city}, ${option.country}`;
              } else if (option.country) {
                extraData = option.country;
              }
            }
            return (
              <Option key={option.id} value={option.id}>
                <Content>
                  <span className={'content'}>
                    <img src={option['image_url']} alt={option.name} />
                  </span>
                  <span className={'content event-data'}>
                    <span className={'name'}>{option.name}</span>
                    <span className={'extra-data'}>{option.start_date}</span>
                    {extraData && <span className={'extra-data'}>{extraData}</span>}
                  </span>
                </Content>
              </Option>
            );
          })}
      </BaseSelect>
    </Item>
  );
};

export default SelectEvent;
