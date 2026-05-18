export function parseSalaryRange(salaryString: string): { minValue: number; maxValue: number } | null {
  // Expected format: "₦800k - ₦1.5M" or similar
  const match = salaryString.match(/₦([0-9.]+)(k|M)\s*-\s*₦([0-9.]+)(k|M)/);
  if (!match) return null;

  const [, minStr, minUnit, maxStr, maxUnit] = match;

  const parseValue = (str: string, unit: string): number => {
    const num = parseFloat(str);
    if (unit === 'k') return num * 1000;
    if (unit === 'M') return num * 1000000;
    return num;
  };

  const minValue = parseValue(minStr, minUnit);
  const maxValue = parseValue(maxStr, maxUnit);

  return { minValue, maxValue };
}