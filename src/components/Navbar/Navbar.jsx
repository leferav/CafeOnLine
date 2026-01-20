import { NavLink } from "react-router-dom";
import { useI18n } from "../../i18n/i18n";
import "./Navbar.css";

export default function Navbar() {
  const { lang, setLang, t } = useI18n();
  return (
    <nav className="navbar">
      <div className="logo">☕ {t('appName')}</div>

      <div className="links">
        <NavLink to="/">{t('home')}</NavLink>
        <NavLink to="/lotes">{t('lots')}</NavLink>
        <NavLink to="/lotes/novo">{t('newLot')}</NavLink>
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
  );
}
