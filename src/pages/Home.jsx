import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useI18n } from "../i18n/i18n";
import { HOME_QUICK_CARDS, obterLinkLotes } from "../auth/routes";
import { loadLots } from "../lib/storage";

export default function Home() {
  const { temPermissao } = useAuth();
  const { t } = useI18n();
  const lots = loadLots();
  const linkLotes = obterLinkLotes(temPermissao);

  const cards = HOME_QUICK_CARDS
    .filter((card) => temPermissao(card.permissao))
    .map((card) => ({
      ...card,
      title: t(card.titleKey),
      text: t(card.textKey),
      action:
        card.dynamicAction === "lotesCount"
          ? t(card.actionKey, { count: lots.length })
          : t(card.actionKey),
    }));

  return (
    <div className="dashboard-layout">
      <section className="hero-panel">
        <div className="hero-panel__content">
          <span className="hero-badge">{t("home.badge")}</span>
          <h1 className="hero-title">{t("home.title")}</h1>
          <p className="hero-text">{t("home.subtitle")}</p>
        </div>

        {linkLotes && (
          <div className="hero-stat-card hero-stat-wide">
            <div className="hero-stat-icon">☕</div>
            <div>
              <strong className="hero-stat-number">{lots.length}</strong>
              <span className="hero-stat-label">
                {lots.length === 1 ? t("home.lotRegistered") : t("home.lotsRegistered")}
              </span>
            </div>
            <Link to={linkLotes} className="hero-detail-link">
              <span>⌁</span>
              {t("home.viewDetails")}
            </Link>
          </div>
        )}
      </section>

      {cards.length > 0 && (
        <section>
          <h2 className="section-title">{t("home.quickAccess")}</h2>
          <p className="muted section-subtitle">{t("home.quickAccessHint")}</p>

          <div className="quick-grid">
            {cards.map((card) => (
              <article className="quick-card" key={card.titleKey}>
                <div className="quick-icon">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
                <Link to={card.to} className="btn-link">
                  {card.action}
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
