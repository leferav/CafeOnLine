import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export const PERFIS = {
  ADMIN: "ADMIN",
  COMERCIAL: "COMERCIAL",
  COMPRADOR: "COMPRADOR",
  PRODUTOR: "PRODUTOR",
};

export const PERMISSOES = {
  DASHBOARD: "DASHBOARD",
  CADASTROS: "CADASTROS",
  CLIENTES: "CLIENTES",
  LOTES: "LOTES",
  NOVO_LOTE: "NOVO_LOTE",
  COMPRAS: "COMPRAS",
  VENDAS: "VENDAS",
  DOCUMENTOS: "DOCUMENTOS",
  RELATORIOS: "RELATORIOS",
  CONFIGURACOES: "CONFIGURACOES",
  PERFIL: "PERFIL",
  NEGOCIACOES: "NEGOCIACOES",
};

const USUARIOS_TESTE = [
  {
    nome: "Administrador",
    email: "admin@cafeonline.com",
    senha: "cafe2026",
    perfil: PERFIS.ADMIN,
    permissoes: Object.values(PERMISSOES),
  },
  {
    nome: "Comercial",
    email: "comercial@cafeonline.com",
    senha: "cafe2026",
    perfil: PERFIS.COMERCIAL,
    permissoes: [
      PERMISSOES.DASHBOARD,
      PERMISSOES.CLIENTES,
      PERMISSOES.LOTES,
      PERMISSOES.VENDAS,
    ],
  },
  {
    nome: "Comprador",
    email: "comprador@cafeonline.com",
    senha: "cafe2026",
    perfil: PERFIS.COMPRADOR,
    permissoes: [
      PERMISSOES.DASHBOARD,
      PERMISSOES.LOTES,
      PERMISSOES.COMPRAS,
      PERMISSOES.DOCUMENTOS,
      PERMISSOES.PERFIL,
    ],
  },
  {
    nome: "Produtor",
    email: "produtor@cafeonline.com",
    senha: "cafe2026",
    perfil: PERFIS.PRODUTOR,
    permissoes: [
      PERMISSOES.DASHBOARD,
      PERMISSOES.CADASTROS,
      PERMISSOES.LOTES,
      PERMISSOES.NOVO_LOTE,
      PERMISSOES.VENDAS,
      PERMISSOES.DOCUMENTOS,
      PERMISSOES.PERFIL,
    ],
  },
];

function carregarUsuarioSessao() {
  const usuarioSalvo = sessionStorage.getItem("usuario");

  if (!usuarioSalvo) return null;

  try {
    return JSON.parse(usuarioSalvo);
  } catch {
    sessionStorage.removeItem("usuario");
    sessionStorage.removeItem("auth");
    return null;
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(carregarUsuarioSessao);

  function login(email, senha) {
    const usuarioEncontrado = USUARIOS_TESTE.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.senha === senha
    );

    if (!usuarioEncontrado) return false;

    const usuarioSessao = {
      nome: usuarioEncontrado.nome,
      email: usuarioEncontrado.email,
      perfil: usuarioEncontrado.perfil,
      permissoes: usuarioEncontrado.permissoes,
    };

    sessionStorage.setItem("auth", "true");
    sessionStorage.setItem("usuario", JSON.stringify(usuarioSessao));
    setUsuario(usuarioSessao);

    return true;
  }

  function logout() {
    sessionStorage.removeItem("auth");
    sessionStorage.removeItem("usuario");
    setUsuario(null);
  }

  function temPermissao(permissao) {
    if (!usuario) return false;
    if (!permissao) return true;

    const permissoesNecessarias = Array.isArray(permissao)
      ? permissao
      : [permissao];

    return permissoesNecessarias.some((p) => usuario.permissoes?.includes(p));
  }

  const value = useMemo(
    () => ({
      authenticated: !!usuario,
      usuario,
      perfil: usuario?.perfil,
      permissoes: usuario?.permissoes || [],
      login,
      logout,
      temPermissao,
    }),
    [usuario]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }

  return context;
}
