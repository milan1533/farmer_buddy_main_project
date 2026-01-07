export const formatINR = (value, options = {}) => {
  const numberValue = Number(value);
  const {
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  if (Number.isNaN(numberValue)) {
    return '0.00';
  }

  return numberValue.toLocaleString('en-IN', {
    minimumFractionDigits,
    maximumFractionDigits,
  });
};

