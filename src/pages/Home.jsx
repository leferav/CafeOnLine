import { Link } from "react-router-dom";
import { useI18n } from "../i18n/i18n";
import { loadLots } from "../lib/storage";

export default function Home() {
  const { t } = useI18n();
  const lots = loadLots();

  return (
    <div>
      <h2>{t("appName")}</h2>
      <p>
        Painel interno para cadastrar e publicar lotes com padrão único de escrita e informações (PT/EN).
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
        <Link to="/lotes/novo" className="btn-link">
          + {t("newLot")}
        </Link>
        <Link to="/lotes" className="btn-link">
          {t("lots")} ({lots.length})
        </Link>
      </div>
    </div>
  );
}
