import { NavLink, useLocation } from "react-router-dom";
import { useI18n } from "../../i18n/i18n";
import "./Navbar.css";

export default function Navbar() {
  const { lang, setLang, t } = useI18n();
  const location = useLocation();

  const isCadastros = location.pathname === "/lotes/novo" || location.pathname.startsWith("/cadastros");
  const isVendas = location.pathname.startsWith("/compras") || location.pathname.startsWith("/vendas");
  const isLotes = location.pathname.startsWith("/lotes") && !location.pathname.endsWith("/novo");

  return (
    <header className="navbar-wrap">
      <nav className="navbar">
        <div className="brand-block">
          <div className="logo">☕ {t("appName")}</div>
          <div className="brand-subtitle">Painel interno de gestão comercial</div>
        </div>

        <div className="links">
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/lotes/novo" className={isCadastros ? "active" : ""}>
            Cadastros
          </NavLink>
          <NavLink to="/compras" className={isVendas ? "active" : ""}>
            Vendas
          </NavLink>
          <NavLink to="/lotes" className={isLotes ? "active" : ""}>
            Lotes
          </NavLink>
        </div>

        <div className="lang">
          <label>
            <span className="sr-only">{t("language")}</span>
            <select value={lang} onChange={(e) => setLang(e.target.value)}>
              <option value="pt">{t("portuguese")}</option>
              <option value="en">{t("english")}</option>
            </select>
          </label>
        </div>
      </nav>
    </header>
  );
}
