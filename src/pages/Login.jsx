import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./Login.css";
import backgroundImage from "../assets/images/FundoLogin.png";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("comercial@cafeonline.com");
    const [senha, setSenha] = useState("cafe2026");

    function handleSubmit(e) {
        e.preventDefault();

        const sucesso = login(email, senha);

        if (!sucesso) {
            alert("E-mail ou senha inválidos.");
            return;
        }

        navigate("/");
    }

    return (
        <main
            className="login-page"
            style={{
                backgroundImage: `url(${backgroundImage})`
            }}
        >
            <section className="login-card">
                <div className="login-logo">☕</div>

                <h1>Café On-line</h1>
                <p>Portal comercial para gestão de compras e lotes de café</p>

                <form onSubmit={handleSubmit}>
                    <label>
                        E-mail
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="cliente@email.com"
                        />
                    </label>

                    <label>
                        Senha
                        <input
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            placeholder="Digite sua senha"
                        />
                    </label>

                    <div className="login-links">
                        <a href="#">Esqueci minha senha</a>
                    </div>

                    <button type="submit">Entrar</button>
                </form>
            </section>
        </main>
    );
}