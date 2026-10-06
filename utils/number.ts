export interface ParsedNumber {
  value: number;
  prefix: string;
  suffix: string;
  decimals: number;
}

export const parseNumber = (input: string): ParsedNumber | null => {
  const match = input.match(/^([^\d+-]*)([+-]?)([\d,]*\.?\d+)(.*)$/);
  if (!match) return null;
  const [, lead, sign, digits, suffix] = match;
  const clean = digits.replace(/,/g, '');
  const decimals = clean.includes('.') ? clean.split('.')[1].length : 0;
  const value = Number(clean) * (sign === '-' ? -1 : 1);
  return { value, prefix: `${sign === '+' ? '+' : ''}${lead}`, suffix, decimals };
};
