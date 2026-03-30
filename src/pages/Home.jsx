import { Link } from "react-router-dom";
import { loadLots } from "../lib/storage";

export default function Home() {
    const lots = loadLots();

    return (
        <div style={{ display: "grid", gap: 28 }}>
            <section className="hero-panel">
                <div className="hero-panel__content">
                    <span className="hero-badge">CAFÉ ON-LINE</span>
                    <h1 className="hero-title">Gestão de Vendas e Compras de Café On-Line!</h1>
                    <p className="hero-text">
                        Sistema...
                    </p>
                </div>

                <div className="hero-stats">
                    <div className="hero-stat-card">
                        <strong className="hero-stat-number">{lots.length}</strong>
                        <span className="hero-stat-label">
                            {lots.length === 1 ? "Lote cadastrado" : "Lotes cadastrados"}
                        </span>
                    </div>
                </div>
            </section>

            <section>
                <h2 style={{ marginBottom: 6 }}>Acessos rápidos</h2>
                <p className="muted" style={{ marginTop: 0 }}>
                    Escolha a área que deseja usar.
                </p>

                <div className="quick-grid">
                    <div className="quick-card">
                        <h3>Cadastros</h3>
                        <p>
                            Cadastrar novos lotes e iniciar a base de informações comerciais do
                            sistema.
                        </p>
                        <Link to="/lotes/novo" className="btn-link">
                            Novo cadastro
                        </Link>
                    </div>

                    <div className="quick-card">
                        <h3>Vendas</h3>
                        <p>
                            Montar pedidos, simular compra parcial, lote inteiro ou múltiplos
                            lotes.
                        </p>
                        <Link to="/compras" className="btn-link">
                            Abrir vendas
                        </Link>
                    </div>

                    <div className="quick-card">
                        <h3>Lotes</h3>
                        <p>
                            Visualizar os lotes cadastrados, consultar detalhes e editar
                            informações.
                        </p>
                        <Link to="/lotes" className="btn-link">
                            Ver lotes ({lots.length})
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}