import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./Login.css";
import { useEffect } from "react";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [documento, setDocumento] = useState("");

    function handleSubmit(e) {
        e.preventDefault();

        const sucesso = login(email, documento);

        if (!sucesso) {
            alert("E-mail/documento inválido ou cliente sem acesso ao portal.");
            return;
        }

        navigate("/");
    }

    return (
        <main className="login-page">
            <section className="login-card">
                <div className="login-logo">☕</div>

                <h1>Café On-line</h1>
                <p>Acesse o painel comercial</p>

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
                        CPF/CNPJ
                        <input
                            type="text"
                            value={documento}
                            onChange={(e) => setDocumento(e.target.value)}
                            placeholder="Digite exatamente como cadastrado"
                        />
                    </label>

                    <button type="submit">Entrar</button>
                </form>
            </section>
        </main>
    );
}