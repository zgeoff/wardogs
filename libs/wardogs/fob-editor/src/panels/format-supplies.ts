const formatter = new Intl.NumberFormat('en');

export function formatSupplies(supplies: number): string {
  return formatter.format(supplies);
}
