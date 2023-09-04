export const setDefaultValue = (value: any): string => {
  const comparison = [null, undefined];
  return comparison.includes(value) ? '' : value;
};
