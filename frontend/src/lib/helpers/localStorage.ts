export const safeGetItem = (key: string) => JSON.parse(localStorage.getItem(key) || '{}');
