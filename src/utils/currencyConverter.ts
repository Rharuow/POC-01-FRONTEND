export function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    currency: "BRL",
    maximumFractionDigits: 2,
    style: "currency",
  });
}
