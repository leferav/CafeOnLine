import { PERMISSOES } from "./AuthContext";

export const ROTA_SEM_ACESSO = "/sem-acesso";

export const PERMISSAO_LOTES = [PERMISSOES.CADASTROS, PERMISSOES.LOTES];
export const PERMISSAO_COMPRAS_VENDAS = [PERMISSOES.COMPRAS, PERMISSOES.VENDAS];
export const PERMISSAO_NEGOCIACOES = [
  PERMISSOES.NEGOCIACOES,
  PERMISSOES.COMPRAS,
  PERMISSOES.VENDAS,
];
export const PERMISSAO_CADASTROS_HUB = [
  PERMISSOES.CADASTROS,
  PERMISSOES.CLIENTES,
  PERMISSOES.LOTES,
];

/** URLs canônicas do fluxo de lotes por contexto. */
export const ROTAS_LOTES = {
  cadastro: {
    lista: "/cadastros/lotes",
    novo: "/cadastros/lotes/novo",
    detalhe: (id) => `/cadastros/lotes/${id}`,
    editar: (id) => `/cadastros/lotes/${id}/editar`,
  },
  compra: {
    lista: "/comprar-cafe",
    detalhe: (id) => `/comprar-cafe/${id}`,
  },
};

/**
 * Definição central de rotas protegidas (ordem importa para rotas dinâmicas).
 * `component` é a chave usada em App.jsx para mapear o React component.
 */
export const ROUTE_PAGES = [
  {
    id: "sem-acesso",
    path: ROTA_SEM_ACESSO,
    component: "SemAcesso",
    permissao: null,
  },
  {
    id: "home",
    path: "/",
    component: "Home",
    permissao: PERMISSOES.DASHBOARD,
    fallback: 10,
    menu: { labelKey: "nav.dashboard", icon: "⌂", exact: true },
  },
  {
    id: "cadastros-hub",
    path: "/cadastros",
    component: "Cadastros",
    permissao: PERMISSAO_CADASTROS_HUB,
    fallback: 20,
    menu: { labelKey: "nav.cadastros", icon: "▤" },
  },
  {
    id: "novo-lote",
    path: "/cadastros/lotes/novo",
    component: "NovoLote",
    permissao: PERMISSOES.NOVO_LOTE,
    fallback: 80,
  },
  {
    id: "editar-lote",
    path: "/cadastros/lotes/:id/editar",
    component: "EditarLote",
    permissao: PERMISSOES.NOVO_LOTE,
  },
  {
    id: "detalhe-lote-cadastro",
    path: "/cadastros/lotes/:id",
    component: "DetalheLote",
    permissao: PERMISSAO_LOTES,
  },
  {
    id: "lotes-cadastro",
    path: "/cadastros/lotes",
    component: "Lotes",
    permissao: PERMISSAO_LOTES,
    fallback: 70,
  },
  {
    id: "comprar-cafe",
    path: "/comprar-cafe",
    component: "Lotes",
    permissao: PERMISSOES.COMPRAS,
    fallback: 30,
    menu: { labelKey: "nav.comprarCafe", icon: "☕" },
  },
  {
    id: "detalhe-lote-compra",
    path: "/comprar-cafe/:id",
    component: "DetalheLote",
    permissao: PERMISSOES.COMPRAS,
  },
  {
    id: "novo-cliente",
    path: "/cadastros/clientes/novo",
    component: "NovoCliente",
    permissao: PERMISSOES.CLIENTES,
  },
  {
    id: "editar-cliente",
    path: "/cadastros/clientes/:id/editar",
    component: "EditarCliente",
    permissao: PERMISSOES.CLIENTES,
  },
  {
    id: "clientes",
    path: "/cadastros/clientes",
    component: "Clientes",
    permissao: PERMISSOES.CLIENTES,
    fallback: 60,
  },
  {
    id: "negociacoes",
    path: "/negociacoes",
    component: "Negociacoes",
    permissao: PERMISSAO_NEGOCIACOES,
    fallback: 50,
    menu: { labelKey: "nav.negociacoes", icon: "↔" },
  },
  {
    id: "prosseguir-compra",
    path: "/compras/:id/prosseguir",
    component: "ProsseguirCompra",
    permissao: PERMISSAO_NEGOCIACOES,
  },
  {
    id: "compras",
    path: "/compras",
    component: "Compras",
    permissao: PERMISSAO_COMPRAS_VENDAS,
    fallback: 40,
    menu: { labelKey: "nav.comprasVendas", icon: "🛒" },
  },
];

export const LEGACY_REDIRECTS = [
  { path: "/vendas", to: "/compras" },
  { path: "/lotes", to: "/comprar-cafe" },
  { path: "/lotes/novo", to: "/cadastros/lotes/novo" },
];

export const CADASTROS_CARDS = [
  {
    icon: "📦",
    titleKey: "cadastros.lots",
    descriptionKey: "cadastros.lotsDesc",
    path: "/cadastros/lotes",
    permissao: PERMISSAO_LOTES,
    implemented: true,
  },
  {
    icon: "👥",
    titleKey: "cadastros.clientes",
    descriptionKey: "cadastros.clientesDesc",
    path: "/cadastros/clientes",
    permissao: PERMISSOES.CLIENTES,
    implemented: true,
  },
  {
    icon: "🌎",
    titleKey: "cadastros.origens",
    descriptionKey: "cadastros.origensDesc",
    path: "/cadastros/origens",
    permissao: PERMISSAO_CADASTROS_HUB,
    implemented: false,
  },
  {
    icon: "🌱",
    titleKey: "cadastros.variedades",
    descriptionKey: "cadastros.variedadesDesc",
    path: "/cadastros/variedades",
    permissao: PERMISSAO_CADASTROS_HUB,
    implemented: false,
  },
  {
    icon: "📅",
    titleKey: "cadastros.safras",
    descriptionKey: "cadastros.safrasDesc",
    path: "/cadastros/safras",
    permissao: PERMISSAO_CADASTROS_HUB,
    implemented: false,
  },
  {
    icon: "🏡",
    titleKey: "cadastros.fornecedores",
    descriptionKey: "cadastros.fornecedoresDesc",
    path: "/cadastros/fornecedores",
    permissao: PERMISSAO_CADASTROS_HUB,
    implemented: false,
  },
];

export const HOME_QUICK_CARDS = [
  {
    icon: "📝",
    titleKey: "home.cardNewLot",
    textKey: "home.cardNewLotText",
    actionKey: "home.cardNewLotAction",
    to: "/cadastros/lotes/novo",
    permissao: PERMISSOES.NOVO_LOTE,
  },
  {
    icon: "🛒",
    titleKey: "home.cardCompras",
    textKey: "home.cardComprasText",
    actionKey: "home.cardComprasAction",
    to: "/compras",
    permissao: PERMISSAO_COMPRAS_VENDAS,
  },
  {
    icon: "☕",
    titleKey: "home.cardComprar",
    textKey: "home.cardComprarText",
    actionKey: "home.cardComprarAction",
    to: "/comprar-cafe",
    permissao: PERMISSOES.COMPRAS,
  },
  {
    icon: "📦",
    titleKey: "home.cardLots",
    textKey: "home.cardLotsText",
    actionKey: "home.cardLotsAction",
    to: "/cadastros/lotes",
    permissao: PERMISSAO_LOTES,
    dynamicAction: "lotesCount",
  },
];

export const MENU = ROUTE_PAGES
  .filter((route) => route.menu)
  .map((route) => ({
    labelKey: route.menu.labelKey,
    path: route.path,
    permissao: route.permissao,
    exact: route.menu.exact,
    icon: route.menu.icon,
  }));

export const ROTAS_FALLBACK = ROUTE_PAGES
  .filter((route) => route.fallback)
  .sort((a, b) => a.fallback - b.fallback)
  .map((route) => ({ path: route.path, permissao: route.permissao }));

export function filtrarMenuPorPermissao(temPermissao) {
  return MENU.filter((item) => temPermissao(item.permissao));
}

export function filtrarCadastrosPorPermissao(temPermissao) {
  return CADASTROS_CARDS.filter((item) => temPermissao(item.permissao));
}

export function obterPrimeiraRotaAcessivel(temPermissao) {
  const rota = ROTAS_FALLBACK.find((item) => temPermissao(item.permissao));
  return rota?.path ?? ROTA_SEM_ACESSO;
}

export function obterPrimeiraRotaParaUsuario(permissoes) {
  const temPermissao = (permissao) => {
    if (!permissao) return true;
    const necessarias = Array.isArray(permissao) ? permissao : [permissao];
    return necessarias.some((p) => permissoes?.includes(p));
  };
  return obterPrimeiraRotaAcessivel(temPermissao);
}

export function obterLinkLotes(temPermissao) {
  if (temPermissao(PERMISSOES.COMPRAS)) return ROTAS_LOTES.compra.lista;
  if (temPermissao(PERMISSAO_LOTES)) return ROTAS_LOTES.cadastro.lista;
  return null;
}

export function obterContextoLotes(pathname) {
  return pathname.startsWith("/comprar-cafe") ? "compra" : "cadastro";
}

export function obterRotasLotes(pathname) {
  return ROTAS_LOTES[obterContextoLotes(pathname)];
}
