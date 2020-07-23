export const safeGetItem = (key: string, defaultValue = '{}') => JSON.parse(localStorage.getItem(key) || defaultValue);
