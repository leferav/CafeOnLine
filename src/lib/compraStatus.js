import { STATUS_LABEL_KEYS } from "./comprasStorage";

export function getStatusLabelKey(status) {
  return STATUS_LABEL_KEYS[status] || status || "-";
}

export function getStatusLabel(t, status) {
  const key = getStatusLabelKey(status);
  return key.startsWith("negociacoes.") ? t(key) : key;
}
