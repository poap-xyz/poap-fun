import React, { FC, useState } from 'react';

// Components
import { Search } from 'ui/styled/antd/Input';
import { Item } from 'ui/styled/antd/Form';
import { HelpText } from 'ui/styled/HelpText';

type SearchProps = {
  name: string;
  placeholder: string;
  buttonText: string;
  helpText?: string;
  label: string;
  handleEnter: (value: string) => void;
  className?: string;
  size?: 'large' | 'small';
};

const InputSearch: FC<SearchProps> = ({
  className,
  name,
  label,
  placeholder,
  handleEnter,
  buttonText,
  helpText,
  size = 'large',
}) => {
  const [value, setValue] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  const onEnter = (value: string) => {
    handleEnter(value);
    setValue('');
  };

  return (
    <Item className={className} label={label}>
      <Search
        name={name}
        placeholder={placeholder}
        size={size}
        onSearch={onEnter}
        enterButton={buttonText}
        value={value}
        onChange={handleChange}
      />
      {helpText && <HelpText>{helpText}</HelpText>}
    </Item>
  );
};

export default InputSearch;
