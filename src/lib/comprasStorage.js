import { aplicarVendaLotes } from "./storage";

const KEY = "comprasCafeOnline";
export const COMPRAS_STORAGE_KEY = KEY;
export const COMPRAS_UPDATED_EVENT = "cafe-compras-updated";

export const COMPRA_STATUS = {
  SOLICITADA: "SOLICITADA",
  PEDIDO_ACEITO: "PEDIDO_ACEITO",
  PEDIDO_RECUSADO: "PEDIDO_RECUSADO",
  COMPRA_ACEITA: "COMPRA_ACEITA",
  FINALIZADA: "FINALIZADA",
};

export const CANAL_ACEITE = {
  SISTEMA: "SISTEMA",
  EMAIL: "EMAIL",
};

export const STATUS_LABEL_KEYS = {
  SOLICITADA: "negociacoes.statusSolicitada",
  COMPRA_ACEITA: "negociacoes.statusCompraAceita",
  PEDIDO_ACEITO: "negociacoes.statusPedidoAceito",
  PEDIDO_RECUSADO: "negociacoes.statusPedidoRecusado",
  FINALIZADA: "negociacoes.statusFinalizada",
};

export function loadCompras() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];

    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];

    const sorted = [...data].sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );

    try {
      sessionStorage.setItem(KEY, JSON.stringify(sorted));
    } catch {
      // espelha na sessão da aba atual; leitura sempre vem do localStorage
    }

    return sorted;
  } catch {
    return [];
  }
}

export function saveCompras(compras) {
  const json = JSON.stringify(compras);
  localStorage.setItem(KEY, json);
  try {
    sessionStorage.setItem(KEY, json);
  } catch {
    // sessionStorage pode falhar em modo privado extremo
  }
  window.dispatchEvent(new CustomEvent(COMPRAS_UPDATED_EVENT));
}

export function getCompraById(id) {
  return loadCompras().find((compra) => compra.id === id) ?? null;
}

export function salvarCompra(compra) {
  const compras = loadCompras();
  const atualizadas = [compra, ...compras.filter((item) => item.id !== compra.id)];
  saveCompras(atualizadas);
  return compra;
}

function patchCompra(id, patch) {
  const compras = loadCompras();
  const index = compras.findIndex((c) => c.id === id);
  if (index < 0) return null;

  const atualizada = { ...compras[index], ...patch };
  compras[index] = atualizada;
  saveCompras(compras);
  return atualizada;
}

export function aceitarCompra(id, usuario, canal = CANAL_ACEITE.SISTEMA) {
  const compra = getCompraById(id);
  if (!compra || compra.status !== COMPRA_STATUS.SOLICITADA) return compra;

  const atualizada = patchCompra(id, {
    status: COMPRA_STATUS.PEDIDO_ACEITO,
    updatedAt: new Date().toISOString(),
    aceite: {
      canal,
      aceitoEm: new Date().toISOString(),
      aceitoPorNome: usuario?.nome || "-",
      aceitoPorEmail: usuario?.email || "-",
    },
  });

  if (atualizada) {
    aplicarVendaLotes(atualizada.items);
  }

  return atualizada;
}

export function recusarCompra(id, usuario, canal = CANAL_ACEITE.SISTEMA) {
  return patchCompra(id, {
    status: COMPRA_STATUS.PEDIDO_RECUSADO,
    updatedAt: new Date().toISOString(),
    aceite: {
      canal,
      aceitoEm: new Date().toISOString(),
      aceitoPorNome: usuario?.nome || "-",
      aceitoPorEmail: usuario?.email || "-",
    },
  });
}

export function montarLinkProsseguir(compraOrId) {
  const compra =
    typeof compraOrId === "string"
      ? { id: compraOrId }
      : compraOrId;

  const compraId = compra?.id;
  if (!compraId) return `${window.location.origin}/negociacoes`;

  const base = `${window.location.origin}/negociacoes?compra=${encodeURIComponent(compraId)}`;

  if (!compra?.items?.length) return base;

  try {
    const payload = btoa(unescape(encodeURIComponent(JSON.stringify(compra))));
    return `${base}&d=${encodeURIComponent(payload)}`;
  } catch {
    return base;
  }
}

/** Restaura compra embutida no link do e-mail quando não existe no storage local. */
export function importarCompraDeUrlParam(encoded) {
  if (!encoded) return null;

  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    const compra = JSON.parse(json);
    if (!compra?.id || !Array.isArray(compra.items) || compra.items.length === 0) return null;
    return salvarCompra(compra);
  } catch {
    return null;
  }
}

/** Agrupa linhas do mesmo lote e soma quantidades antes de salvar. */
export function consolidarItensCompra(items) {
  const map = new Map();

  for (const item of items || []) {
    const qty = Number(item.quantity || 0);
    const unitPrice = Number(item.unitPrice || 0);

    if (map.has(item.lotId)) {
      const atual = map.get(item.lotId);
      const novaQty = atual.quantity + qty;
      map.set(item.lotId, {
        ...atual,
        quantity: novaQty,
        subtotal: novaQty * unitPrice,
      });
    } else {
      map.set(item.lotId, {
        ...item,
        quantity: qty,
        subtotal: qty * unitPrice,
      });
    }
  }

  return Array.from(map.values());
}

export function calcularTotaisCompra(items) {
  const list = items || [];
  const totalSacks = list.reduce((acc, item) => acc + Number(item.quantity || 0), 0);
  const lotsCount = list.length;
  const total = list.reduce((acc, item) => acc + Number(item.subtotal || 0), 0);
  return { totalSacks, lotsCount, total };
}

export function obterResumoNegociacao(negociacao) {
  const items = negociacao?.items ?? [];
  const totalSacks =
    negociacao?.totalSacks ??
    items.reduce((acc, item) => acc + Number(item.quantity || 0), 0);
  const lotsCount = negociacao?.lotsCount ?? items.length;
  return { items, totalSacks, lotsCount, first: items[0] || {} };
}

export function listarComprasPendentes() {
  return loadCompras().filter((compra) => compra.status === COMPRA_STATUS.SOLICITADA);
}
