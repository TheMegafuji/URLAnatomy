export interface NumberResult {
  type: 'number';
  numericType: 'integer' | 'float';
  value: number;
  integerDigits: number;
  decimalDigits: number;
  leadingZeros: number;
  totalLength: number;
  formatted: string;
}

export function detectNumber(value: string): NumberResult | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const numRegex = /^-?\d+(\.\d+)?([eE][+-]?\d+)?$/;
  if (!numRegex.test(trimmed)) return null;

  const num = parseFloat(trimmed);
  if (isNaN(num) || !isFinite(num)) return null;

  const isInteger = Number.isInteger(num);
  const numericType: 'integer' | 'float' = isInteger ? 'integer' : 'float';

  const parts = trimmed.split('.');
  const integerPart = parts[0].replace(/^-/, '');
  const decimalPart = parts[1] || '';

  let leadingZeros = 0;
  for (let i = 0; i < integerPart.length; i++) {
    if (integerPart[i] === '0') {
      leadingZeros++;
    } else {
      break;
    }
  }
  if (leadingZeros === integerPart.length && integerPart.length > 0) {
    leadingZeros = integerPart.length - 1;
  }

  const integerDigits = integerPart.length;
  const decimalDigits = decimalPart.length;
  const totalLength = trimmed.replace(/^-/, '').length;

  let formatted = num.toLocaleString('en-US', {
    minimumFractionDigits: decimalDigits,
    maximumFractionDigits: decimalDigits,
  });

  if (num < 0) formatted = '-' + formatted;

  return {
    type: 'number',
    numericType,
    value: num,
    integerDigits,
    decimalDigits,
    leadingZeros,
    totalLength,
    formatted,
  };
}
