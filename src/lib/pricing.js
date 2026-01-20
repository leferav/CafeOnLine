// NOTE: Sem back-end ainda, estes valores são MOCK.
// Depois você pode substituir por uma chamada a API (bolsa NY + câmbio).
export const nyMockUsd = {
  "Jan": 1.85,
  "Feb": 1.86,
  "Mar": 1.88,
  "Apr": 1.90,
  "May": 1.92,
  "Jun": 1.95,
  "Jul": 1.93,
  "Aug": 1.91,
  "Sep": 1.89,
  "Oct": 1.87,
  "Nov": 1.86,
  "Dec": 1.84,
};

export const fxMock = {
  USD: 1,
  BRL: 5.0,
  EUR: 0.92,
  GBP: 0.78,
};

// Conversão simples de unidade partindo de "por libra" (lb) -> kg/ton/saca.
// Se o seu "dif" não for USD/lb, ajuste aqui depois.
const LB_TO_KG = 0.45359237;

export function sumDiff(parts) {
  return (Number(parts.coffeeDiff) || 0)
    + (Number(parts.originLogDiff) || 0)
    + (Number(parts.destLogDiff) || 0)
    + (Number(parts.loadingDiff) || 0);
}

export function computeTotals({ nyBaseUsdPerLb, finalDiffUsdPerLb }) {
  const ny = Number(nyBaseUsdPerLb) || 0;
  const diff = Number(finalDiffUsdPerLb) || 0;
  const totalUsdPerLb = ny + diff;

  const perKg = totalUsdPerLb / LB_TO_KG;
  const perTon = perKg * 1000;
  const perSack60 = perKg * 60;
  const perSack30 = perKg * 30;

  return { totalUsdPerLb, perKg, perTon, perSack60, perSack30 };
}

export function convertCurrency(amountUsd, toCurrency) {
  const rate = fxMock[toCurrency] ?? 1;
  return amountUsd * rate;
}
