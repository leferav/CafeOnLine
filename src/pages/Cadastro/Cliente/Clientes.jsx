import { Link } from "react-router-dom";
import { listarClientes, excluirCliente } from "./clientesStorage";
import "../FormCadastro.css";
import { useState } from "react";

export default function Clientes() {
    const [clientes, setClientes] = useState(listarClientes());

    function handleExcluir(id) {
        const confirmar = window.confirm(
            "Deseja realmente excluir este cliente?"
        );

        if (!confirmar) return;

        excluirCliente(id);

        setClientes((clientesAtuais) =>
            clientesAtuais.filter(
                (cliente) => cliente.id !== id
            )
        );
    }
//tstessssssssss


    return (
        <section>
            <div className="page-header">
                <div>
                    <h1>Clientes</h1>
                    <p>Gerencie os clientes cadastrados no sistema.</p>
                </div>

                <div className="actions">
                    <Link to="/cadastros/clientes/novo" className="btn-primary">
                        Novo Cliente
                    </Link>
                </div>
            </div>

            <div className="form-card">
                <h2>Clientes cadastrados</h2>

                {clientes.length === 0 ? (
                    <p>Nenhum cliente cadastrado.</p>
                ) : (
                    <table className="table-list">
                        <thead>
                        <tr>
                            <th>Nome / Razão Social</th>
                            <th>Tipo</th>
                            <th>Documento</th>
                            <th>E-mail</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                        </thead>

                        <tbody>
                        {clientes.map((cliente) => (
                            <tr key={cliente.id}>
                                <td>{cliente.nomeRazaoSocial}</td>
                                <td>{cliente.tipoPessoa}</td>
                                <td>{cliente.documento}</td>
                                <td>{cliente.email}</td>
                                <td>{cliente.status}</td>
                                <div className="table-actions">
                                    <Link
                                        to={`/cadastros/clientes/${cliente.id}/editar`}
                                        className="btn-edit"
                                    >
                                        ✏️ Editar
                                    </Link>

                                    <button
                                        type="button"
                                        className="btn-delete"
                                        onClick={() => handleExcluir(cliente.id)}
                                    >
                                        🗑 Excluir
                                    </button>
                                </div>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </section>
    );
}