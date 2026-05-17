const ANNUAL_RATE = 0.14; // 14% annual

export function calcMonthlyPayment(
  carPrice: number,
  downPayment: number,
  termMonths: number,
): number {
  const principal = carPrice - downPayment;
  if (principal <= 0 || termMonths <= 0) return 0;
  const r = ANNUAL_RATE / 12;
  const payment = (principal * r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1);
  return Math.round(payment);
}
