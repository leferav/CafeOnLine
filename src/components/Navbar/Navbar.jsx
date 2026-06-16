import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useI18n } from "../../i18n/i18n";
import LanguageMenu from "../LanguageMenu/LanguageMenu";
import "./Navbar.css";
import { useAuth } from "../../auth/AuthContext";
import { filtrarMenuPorPermissao } from "../../auth/routes";

export default function Navbar() {
  const { t } = useI18n();
  const location = useLocation();
  const { usuario, logout, temPermissao } = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);

  const menu = filtrarMenuPorPermissao(temPermissao);
  const perfilAtual = usuario?.perfil || "";
  const nomeAtual = usuario?.nome || "";

  const LIMITE_BOTTOM_NAV = 4;
  const bottomNavItems =
    menu.length <= LIMITE_BOTTOM_NAV ? menu : menu.slice(0, LIMITE_BOTTOM_NAV - 1);
  const temMaisItens = menu.length > bottomNavItems.length;

  useEffect(() => {
    setMenuAberto(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuAberto) return undefined;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [menuAberto]);

  function estaAtivo(item) {
    return item.exact
      ? location.pathname === item.path
      : location.pathname.startsWith(item.path);
  }

  return (
    <header className="navbar-wrap">
      <nav className="navbar">
        <button
          className="menu-toggle"
          type="button"
          onClick={() => setMenuAberto(true)}
          aria-label={t("nav.openMenu")}
          aria-expanded={menuAberto}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="brand-block">
          <div className="logo">☕ {t("appName")}</div>
          <div className="brand-subtitle">{t("nav.brandSubtitle")}</div>
        </div>

        <div className="links links-desktop">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={estaAtivo(item) ? "active" : ""}
            >
              {t(item.labelKey)}
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

          <button className="notification-btn" type="button" aria-label={t("nav.notifications")}>
            🔔<span></span>
          </button>

          <LanguageMenu variant="navbar" />

          <button className="btn-logout btn-logout-desktop" onClick={logout} type="button">
            ⎋ {t("nav.logout")}
          </button>
        </div>
      </nav>

      <div className="mobile-user-card">
        <span className="user-name">👤 {perfilAtual}<small>{nomeAtual}</small></span>
        <button className="btn-logout" onClick={logout} type="button">
          ⎋ {t("nav.logout")}
        </button>
      </div>

      <div className={`drawer-overlay ${menuAberto ? "open" : ""}`} onClick={() => setMenuAberto(false)} />

      <aside className={`mobile-drawer ${menuAberto ? "open" : ""}`} aria-hidden={!menuAberto}>
        <div className="drawer-header">
          <div>
            <strong>☕ {t("appName")}</strong>
            <span>{t("nav.mainMenu")}</span>
          </div>
          <button type="button" onClick={() => setMenuAberto(false)} aria-label={t("nav.closeMenu")}>
            ×
          </button>
        </div>

        <div className="drawer-user">👤 {perfilAtual}<small>{nomeAtual}</small></div>

        <div className="drawer-links">
          {menu.map((item) => (
            <NavLink
              key={`drawer-${item.path}`}
              to={item.path}
              end={item.exact}
              className={estaAtivo(item) ? "active" : ""}
            >
              <span>{item.icon || "•"}</span>
              {t(item.labelKey)}
            </NavLink>
          ))}
        </div>

        <LanguageMenu variant="drawer" />

        <button className="drawer-logout" onClick={logout} type="button">
          ⎋ {t("nav.logoutFull")}
        </button>
      </aside>

      <nav className="bottom-nav" aria-label={t("nav.quickMenu")}>
        {bottomNavItems.map((item) => (
          <NavLink
            key={`bottom-${item.path}`}
            to={item.path}
            end={item.exact}
            className={estaAtivo(item) ? "active" : ""}
          >
            <span className="bottom-nav-icon">{item.icon || "•"}</span>
            <span className="bottom-nav-label">{t(item.labelKey)}</span>
          </NavLink>
        ))}

        {temMaisItens && (
          <button
            type="button"
            className={`bottom-nav-more ${menuAberto ? "active" : ""}`}
            onClick={() => setMenuAberto(true)}
            aria-label={t("nav.moreOptions")}
            aria-expanded={menuAberto}
          >
            <span className="bottom-nav-icon">☰</span>
            <span className="bottom-nav-label">{t("nav.more")}</span>
          </button>
        )}
      </nav>
    </header>
  );
}
