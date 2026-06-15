import { PERMISSOES } from "./AuthContext";

export const MENU = [
  { label: "Dashboard", path: "/", permissao: PERMISSOES.DASHBOARD, exact: true },
  { label: "Cadastros", path: "/cadastros", permissao: PERMISSOES.CADASTROS },
  { label: "Comprar Café", path: "/comprar-cafe", permissao: PERMISSOES.COMPRAS },
  { label: "Vendas", path: "/compras", permissao: PERMISSOES.VENDAS },
  { label: "Compras", path: "/compras", permissao: PERMISSOES.COMPRAS },
  { label: "Negociações", path: "/negociacoes", permissao: PERMISSOES.COMPRAS },
];

export function filtrarMenuPorPermissao(temPermissao) {
  return MENU.filter((item) => temPermissao(item.permissao));
}
