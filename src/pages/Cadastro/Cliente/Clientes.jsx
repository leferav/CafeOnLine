import { Link } from "react-router-dom";
import { listarClientes, excluirCliente } from "./clientesStorage";
import "../FormCadastro.css";
import { useState } from "react";
import { useI18n } from "../../../i18n/i18n";

export default function Clientes() {
    const { t } = useI18n();
    const [clientes, setClientes] = useState(listarClientes());

    function handleExcluir(id) {
        const confirmar = window.confirm(t("clientes.deleteConfirm"));

        if (!confirmar) return;

        excluirCliente(id);

        setClientes((clientesAtuais) =>
            clientesAtuais.filter((cliente) => cliente.id !== id)
        );
    }

    return (
        <section>
            <div className="page-header">
                <div>
                    <h1>{t("clientes.title")}</h1>
                    <p>{t("clientes.subtitle")}</p>
                </div>

                <div className="actions">
                    <Link to="/cadastros/clientes/novo" className="btn-primary">
                        {t("clientes.new")}
                    </Link>
                </div>
            </div>

            <div className="form-card">
                <h2>{t("clientes.registered")}</h2>

                {clientes.length === 0 ? (
                    <p>{t("clientes.empty")}</p>
                ) : (
                    <table className="table-list">
                        <thead>
                        <tr>
                            <th>{t("clientes.name")}</th>
                            <th>{t("clientes.type")}</th>
                            <th>{t("clientes.document")}</th>
                            <th>{t("clientes.email")}</th>
                            <th>{t("clientes.status")}</th>
                            <th></th>
                        </tr>
                        </thead>

                        <tbody>
                        {clientes.map((cliente) => (
                            <tr key={cliente.id}>
                                <td>{cliente.nomeRazaoSocial}</td>
                                <td>{cliente.tipoPessoa === "PF" ? t("clientes.pf") : t("clientes.pj")}</td>
                                <td>{cliente.documento}</td>
                                <td>{cliente.email}</td>
                                <td>{cliente.status === "Ativo" ? t("clientes.active") : t("clientes.inactive")}</td>
                                <td>
                                <div className="table-actions">
                                    <Link
                                        to={`/cadastros/clientes/${cliente.id}/editar`}
                                        className="btn-outline btn-sm"
                                    >
                                        {t("clientes.edit")}
                                    </Link>

                                    <button
                                        type="button"
                                        className="btn-danger btn-sm"
                                        onClick={() => handleExcluir(cliente.id)}
                                    >
                                        🗑 {t("clientes.delete")}
                                    </button>
                                </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </section>
    );
}
