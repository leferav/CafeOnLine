import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useI18n } from "../i18n/i18n";
import { obterPrimeiraRotaAcessivel, ROTA_SEM_ACESSO } from "../auth/routes";

export default function SemAcesso() {
  const { logout, usuario, temPermissao } = useAuth();
  const { t } = useI18n();
  const destino = obterPrimeiraRotaAcessivel(temPermissao);

  if (destino !== ROTA_SEM_ACESSO) {
    return <Navigate to={destino} replace />;
  }

  return (
    <div className="dashboard-layout">
      <section className="hero-panel">
        <div className="hero-panel__content">
          <span className="hero-badge">{t("semAcesso.badge")}</span>
          <h1 className="hero-title">{t("semAcesso.title")}</h1>
          <p className="hero-text">
            {t("semAcesso.text", {
              email: usuario?.email ?? "",
              perfil: usuario?.perfil ?? "",
            })}
          </p>
          <button className="btn-link" type="button" onClick={logout}>
            {t("semAcesso.logout")}
          </button>
        </div>
      </section>
    </div>
  );
}
