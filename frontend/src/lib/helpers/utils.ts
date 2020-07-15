export const objectToGetParams = (object: { [key: string]: string | number | undefined | null }) => {
  const params = Object.entries(object)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);

  return params.length > 0 ? `?${params.join('&')}` : '';
};

export const isMobileOrTablet = () => {
  return /(android|iphone|ipad|mobile)/i.test(navigator.userAgent);
};
