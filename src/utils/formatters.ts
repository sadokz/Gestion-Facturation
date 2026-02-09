export const formatCurrencyDT = (amount: number) => {
  return new Intl.NumberFormat("fr-TN", {
    style: "currency",
    currency: "TND",
    minimumFractionDigits: 3,
  }).format(amount).replace("TND", "DT");
};

export const formatDateFR = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const computeTTC = (ht: number, tvaPct: number) => {
  return ht * (1 + tvaPct / 100);
};