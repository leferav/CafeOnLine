import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { obterPrimeiraRotaParaUsuario } from "../auth/routes";
import { useI18n } from "../i18n/i18n";
import LanguageMenu from "../components/LanguageMenu/LanguageMenu";
import "./Login.css";
import backgroundImage from "../assets/images/FundoLogin.png";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { t } = useI18n();

    const [email, setEmail] = useState("comercial@cafeonline.com");
    const [senha, setSenha] = useState("cafe2026");

    function handleSubmit(e) {
        e.preventDefault();

        const usuario = login(email, senha);

        if (!usuario) {
            alert(t("login.invalidCredentials"));
            return;
        }

        navigate(obterPrimeiraRotaParaUsuario(usuario.permissoes));
    }

    return (
        <main
            className="login-page"
            style={{
                backgroundImage: `url(${backgroundImage})`
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
