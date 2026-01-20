const KEY = "cafe_online_lots_v1";

export function loadLots() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveLots(lots) {
  localStorage.setItem(KEY, JSON.stringify(lots));
}

export function upsertLot(lot) {
  const lots = loadLots();
  const idx = lots.findIndex((x) => x.id === lot.id);
  if (idx >= 0) lots[idx] = lot;
  else lots.unshift(lot);
  saveLots(lots);
  return lots;
}

export function getLotById(id) {
  return loadLots().find((x) => x.id === id) ?? null;
}
