import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useI18n } from "../../i18n/i18n";
import "./Navbar.css";
import { useAuth } from "../../auth/AuthContext";
import { filtrarMenuPorPermissao } from "../../auth/permissions";

const ICONES_MENU = {
  Dashboard: "⌂",
  Cadastros: "▤",
  "Comprar Café": "☕",
  Vendas: "🛒",
  Compras: "🛒",
  Negociações: "↔",
};

export default function Navbar() {
  const { lang, setLang, t } = useI18n();
  const location = useLocation();
  const { usuario, logout, temPermissao } = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);

  const menu = filtrarMenuPorPermissao(temPermissao);
  const langAtual = lang === "en" ? "EN" : "PT";
  const perfilAtual = usuario?.perfil || "";
  const nomeAtual = usuario?.nome || "";

  useEffect(() => {
    setMenuAberto(false);
  }, [location.pathname]);

  function estaAtivo(item) {
    return item.exact
      ? location.pathname === item.path
      : location.pathname.startsWith(item.path);
  }

  function trocarIdioma() {
    setLang(lang === "pt" ? "en" : "pt");
  }

  return (
    <header className="navbar-wrap">
      <nav className="navbar">
        <button
          className="menu-toggle"
          type="button"
          onClick={() => setMenuAberto(true)}
          aria-label="Abrir menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="brand-block">
          <div className="logo">☕ {t("appName")}</div>
          <div className="brand-subtitle">Painel interno de gestão comercial</div>
        </div>

        <div className="links links-desktop">
          {menu.map((item) => (
            <NavLink
              key={`${item.label}-${item.permissao}`}
              to={item.path}
              end={item.exact}
              className={estaAtivo(item) ? "active" : ""}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="top-actions">
          <div className="desktop-user-card" title={`${nomeAtual} - ${perfilAtual}`}>
            <span className="user-icon">👤</span>
            <span className="desktop-user-text">
              <strong>{perfilAtual}</strong>
              <small>{nomeAtual}</small>
            </span>
          </div>

          <button className="notification-btn" type="button" aria-label="Notificações">
            🔔<span></span>
          </button>

          <button className="lang-compact" type="button" onClick={trocarIdioma}>
            {langAtual}⌄
          </button>

          <button className="btn-logout btn-logout-desktop" onClick={logout} type="button">
            ⎋ Sair
          </button>
        </div>
      </nav>

      <div className="mobile-user-card">
        <span className="user-name">👤 {perfilAtual}<small>{nomeAtual}</small></span>
        <button className="btn-logout" onClick={logout} type="button">
          ⎋ Sair
        </button>
      </div>

      <div className={`drawer-overlay ${menuAberto ? "open" : ""}`} onClick={() => setMenuAberto(false)} />

      <aside className={`mobile-drawer ${menuAberto ? "open" : ""}`} aria-hidden={!menuAberto}>
        <div className="drawer-header">
          <div>
            <strong>☕ {t("appName")}</strong>
            <span>Menu principal</span>
          </div>
          <button type="button" onClick={() => setMenuAberto(false)} aria-label="Fechar menu">
            ×
          </button>
        </div>

        <div className="drawer-user">👤 {perfilAtual}<small>{nomeAtual}</small></div>

        <div className="drawer-links">
          {menu.map((item) => (
            <NavLink
              key={`drawer-${item.label}-${item.permissao}`}
              to={item.path}
              end={item.exact}
              className={estaAtivo(item) ? "active" : ""}
            >
              <span>{ICONES_MENU[item.label] || "•"}</span>
              {item.label}
            </NavLink>
          ))}
        </div>

        <button className="drawer-logout" onClick={logout} type="button">
          ⎋ Sair do sistema
        </button>
      </aside>

      <nav className="bottom-nav" aria-label="Menu rápido mobile">
        {menu.slice(0, 4).map((item) => (
          <NavLink
            key={`bottom-${item.label}-${item.permissao}`}
            to={item.path}
            end={item.exact}
            className={estaAtivo(item) ? "active" : ""}
          >
            <span>{ICONES_MENU[item.label] || "•"}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
