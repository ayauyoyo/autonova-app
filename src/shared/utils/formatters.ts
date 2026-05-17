export function formatPrice(value: number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₸';
}

export function formatPriceShort(value: number): string {
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return (m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)) + ' млн ₸';
  }
  if (value >= 1_000) {
    const k = value / 1_000;
    return (k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)) + ' тыс ₸';
  }
  return formatPrice(value);
}

export function formatKm(km: number): string {
  return km.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' км';
}

export function formatMonthly(value: number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₸/мес';
}
