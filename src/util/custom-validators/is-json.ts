export const isJson = (val: any): boolean => {
  try {
    const obj = JSON.parse(JSON.stringify(val));
    return !!obj && typeof obj === 'object';
  } catch (e) {
    /* ignore */
  }
  return false;
};
