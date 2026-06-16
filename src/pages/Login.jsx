import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { obterPrimeiraRotaParaUsuario } from "../auth/routes";
import { useI18n } from "../i18n/i18n";
import LanguageMenu from "../components/LanguageMenu/LanguageMenu";
import "./Login.css";
import backgroundImage from "../assets/images/FundoLogin.png";

function resolverDestinoAposLogin(location, searchParams, permissoes) {
  const from = location.state?.from;
  const fromPath = from?.pathname;
  const redirectParam = searchParams.get("redirect");

  if (fromPath && fromPath.startsWith("/") && !fromPath.startsWith("//")) {
    return fromPath + (from.search || "");
  }

  if (redirectParam && redirectParam.startsWith("/") && !redirectParam.startsWith("//")) {
    return redirectParam;
  }

  return obterPrimeiraRotaParaUsuario(permissoes);
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login, authenticated, permissoes } = useAuth();
  const { t } = useI18n();

  const [email, setEmail] = useState("comercial@cafeonline.com");
  const [senha, setSenha] = useState("cafe2026");

  useEffect(() => {
    if (!authenticated) return;
    navigate(resolverDestinoAposLogin(location, searchParams, permissoes), { replace: true });
  }, [authenticated, location, navigate, permissoes, searchParams]);

  function handleSubmit(e) {
    e.preventDefault();

    const usuario = login(email, senha);

    if (!usuario) {
      alert(t("login.invalidCredentials"));
      return;
    }

    navigate(resolverDestinoAposLogin(location, searchParams, usuario.permissoes), { replace: true });
  }

  return (
    <main
      className="login-page"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="login-lang-bar">
        <span className="login-lang-label">{t("language")}</span>
        <LanguageMenu variant="login" />
      </div>

      <section className="login-card">
        <div className="login-logo">☕</div>

        <h1>{t("login.title")}</h1>
        <p>{t("login.subtitle")}</p>

        {(location.state?.from?.pathname?.includes("/prosseguir") ||
          (location.state?.from?.pathname === "/negociacoes" &&
            location.state?.from?.search?.includes("compra="))) && (
          <p className="login-redirect-hint">{t("login.prosseguirHint")}</p>
        )}

        <form onSubmit={handleSubmit}>
          <label>
            {t("login.email")}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("login.emailPlaceholder")}
            />
          </label>

          <label>
            {t("login.password")}
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder={t("login.passwordPlaceholder")}
            />
          </label>

          <div className="login-links">
            <a href="#">{t("login.forgotPassword")}</a>
          </div>

          <button type="submit" className="login-submit">{t("login.submit")}</button>
        </form>
      </section>
    </main>
  );
}
