import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { useI18n } from "../../i18n/i18n";
import { filtrarCadastrosPorPermissao } from "../../auth/routes";
import "./Cadastros.css";

export default function Cadastros() {
    const { temPermissao } = useAuth();
    const { t } = useI18n();
    const cadastros = filtrarCadastrosPorPermissao(temPermissao);

    return (
        <section className="cadastros-page">
            <div className="cadastros-hero">
                <div>
                    <span className="eyebrow">{t("cadastros.eyebrow")}</span>
                    <h1>{t("cadastros.title")}</h1>
                    <p>{t("cadastros.subtitle")}</p>
                </div>
            </div>

            {cadastros.length === 0 ? (
                <p className="muted">{t("cadastros.noneAvailable")}</p>
            ) : (
                <div className="cadastros-grid">
                    {cadastros.map((item) =>
                        item.implemented ? (
                            <Link key={item.titleKey} to={item.path} className="cadastro-card">
                                <div className="card-icon">{item.icon}</div>
                                <div>
                                    <h2>{t(item.titleKey)}</h2>
                                    <p>{t(item.descriptionKey)}</p>
                                </div>
                                <div className="card-footer">
                                    <span>{t("open")}</span>
                                    <span>→</span>
                                </div>
                            </Link>
                        ) : (
                            <div
                                key={item.titleKey}
                                className="cadastro-card cadastro-card--soon"
                                aria-disabled="true"
                            >
                                <div className="card-icon">{item.icon}</div>
                                <div>
                                    <h2>{t(item.titleKey)}</h2>
                                    <p>{t(item.descriptionKey)}</p>
                                </div>
                                <div className="card-footer">
                                    <span>{t("soon")}</span>
                                    <span className="cadastro-soon-badge">{t("soon")}</span>
                                </div>
                            </div>
                        )
                    )}
                </div>
            )}
        </section>
    );
}
