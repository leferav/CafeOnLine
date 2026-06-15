import { Link } from "react-router-dom";
import { loadLots } from "../lib/storage";

export default function Home() {
  const lots = loadLots();

  const cards = [
    {
      icon: "▣",
      title: "Cadastros",
      text: "Cadastrar novos lotes e iniciar a base de informações comerciais do sistema.",
      to: "/lotes/novo",
      action: "Novo cadastro",
    },
    {
      icon: "🛒",
      title: "Vendas",
      text: "Montar pedidos, simular compra parcial, lote inteiro ou múltiplos lotes.",
      to: "/compras",
      action: "Abrir vendas",
    },
    {
      icon: "⬡",
      title: "Lotes",
      text: "Visualizar os lotes cadastrados, consultar detalhes e editar informações.",
      to: "/lotes",
      action: `Ver lotes (${lots.length})`,
    },
  ];

  return (
    <div className="dashboard-layout">
      <section className="hero-panel">
        <div className="hero-panel__content">
          <span className="hero-badge">CAFÉ ON-LINE</span>
          <h1 className="hero-title">Gestão de Vendas e Compras de Café On-Line!</h1>
          <p className="hero-text">Sistema...</p>
        </div>

        <div className="hero-stat-card hero-stat-wide">
          <div className="hero-stat-icon">☕</div>
          <div>
            <strong className="hero-stat-number">{lots.length}</strong>
            <span className="hero-stat-label">
              {lots.length === 1 ? "Lote cadastrado" : "Lotes cadastrados"}
            </span>
          </div>
          <Link to="/lotes" className="hero-detail-link">
            <span>⌁</span>
            Ver detalhes
          </Link>
        </div>
      </section>

      <section>
        <h2 className="section-title">Acessos rápidos</h2>
        <p className="muted section-subtitle">Escolha a área que deseja usar.</p>

        <div className="quick-grid">
          {cards.map((card) => (
            <article className="quick-card" key={card.title}>
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
    </div>
  );
}
