const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatPrice(amount) {
  if (amount == null || Number.isNaN(amount)) return '₹0';
  return inrFormatter.format(amount);
}
