import React, { useState, useEffect } from 'react';

export const useDebounce = (value: string = '', delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState<string>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [delay, value]);

  return debouncedValue;
};
