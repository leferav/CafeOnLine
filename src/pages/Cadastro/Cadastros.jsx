import { Link } from "react-router-dom";
import "./Cadastros.css";

const cadastros = [
    {
        icon: "📦",
        title: "Lotes",
        description: "Cadastro e manutenção dos lotes de café disponíveis.",
        path: "/cadastros/lotes",
    },
    {
        icon: "👥",
        title: "Clientes",
        description: "Compradores, contatos e empresas clientes.",
        path: "/cadastros/clientes",
    },
    {
        icon: "🌎",
        title: "Origens",
        description: "Regiões produtoras, países e locais de origem.",
        path: "/cadastros/origens",
    },
    {
        icon: "🌱",
        title: "Variedades",
        description: "Catuaí, Mundo Novo, Bourbon e outras variedades.",
        path: "/cadastros/variedades",
    },
    {
        icon: "📅",
        title: "Safras",
        description: "Controle das safras por período e ano agrícola.",
        path: "/cadastros/safras",
    },
    {
        icon: "🏡",
        title: "Fornecedores",
        description: "Produtores, fazendas e parceiros comerciais.",
        path: "/cadastros/fornecedores",
    },
];

export default function Cadastros() {
    return (
        <section className="cadastros-page">
            <div className="cadastros-hero">
                <div>
                    <span className="eyebrow">Gestão comercial</span>
                    <h1>Cadastros</h1>
                    <p>
                        Gerencie os cadastros utilizados nas operações de compra, venda,
                        estoque e comercialização de cafés.
                    </p>
                </div>
            </div>

            <div className="cadastros-grid">
                {cadastros.map((item) => (
                    <Link key={item.title} to={item.path} className="cadastro-card">
                        <div className="card-icon">{item.icon}</div>

                        <div>
                            <h2>{item.title}</h2>
                            <p>{item.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}