import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useI18n } from "../../../i18n/i18n";
import "../FormCadastro.css";
import {
    buscarClientePorId,
    salvarCliente,
} from "./clientesStorage";

function somenteNumeros(valor) {
    return valor.replace(/\D/g, "");
}

function mascaraCpfCnpj(valor, tipo) {
    const numeros = somenteNumeros(valor);

    if (tipo === "PF") {
        return numeros
            .slice(0, 11)
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    return numeros
        .slice(0, 14)
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

function mascaraTelefone(valor) {
    return somenteNumeros(valor)
        .slice(0, 11)
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

function mascaraCep(valor) {
    return somenteNumeros(valor)
        .slice(0, 8)
        .replace(/(\d{5})(\d{1,3})$/, "$1-$2");
}

export default function EditarCliente() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useI18n();

    const [cliente, setCliente] = useState(null);

    useEffect(() => {
        const clienteEncontrado = buscarClientePorId(id);

        if (!clienteEncontrado) {
            navigate("/cadastros/clientes");
            return;
        }

        setCliente({
            grupoAcesso: "consulta",
            ativoPortal: false,
            ...clienteEncontrado,
        });
    }, [id, navigate]);

    function alterarCampo(campo, valor) {
        setCliente((atual) => ({
            ...atual,
            [campo]: valor,
        }));
    }

    function handleTipoPessoaChange(e) {
        const novoTipo = e.target.value;

        setCliente((atual) => ({
            ...atual,
            tipoPessoa: novoTipo,
            documento: "",
        }));
    }

    function handleSalvar() {
        salvarCliente({
            ...cliente,
            dataAlteracao: new Date().toISOString(),
        });

        navigate("/cadastros/clientes");
    }

    if (!cliente) {
        return null;
    }

    return (
        <section>
            <div className="page-header">
                <div>
                    <h1>{t("clientes.editarTitle")}</h1>
                    <p>Atualize as informações cadastrais do comprador.</p>
                </div>

                <div className="actions">
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => navigate("/cadastros/clientes")}
                    >
                        {t("cancel")}
                    </button>

                    <button type="button" className="btn-primary" onClick={handleSalvar}>
                        {t("save")}
                    </button>
                </div>
            </div>

            <div className="form-card">
                <h2>{t("clientes.basicInfo")}</h2>

                <div className="form-grid">
                    <label>
                        Nome / Razão social
                        <input
                            type="text"
                            value={cliente.nomeRazaoSocial}
                            onChange={(e) =>
                                alterarCampo("nomeRazaoSocial", e.target.value)
                            }
                        />
                    </label>

                    <label>
                        Tipo
                        <select value={cliente.tipoPessoa} onChange={handleTipoPessoaChange}>
                            <option value="PF">Pessoa Física</option>
                            <option value="PJ">Pessoa Jurídica</option>
                        </select>
                    </label>

                    <label>
                        {cliente.tipoPessoa === "PF" ? "CPF" : "CNPJ"}
                        <input
                            type="text"
                            value={cliente.documento}
                            onChange={(e) =>
                                alterarCampo(
                                    "documento",
                                    mascaraCpfCnpj(e.target.value, cliente.tipoPessoa)
                                )
                            }
                        />
                    </label>

                    <label>
                        E-mail
                        <input
                            type="email"
                            value={cliente.email}
                            onChange={(e) => alterarCampo("email", e.target.value)}
                        />
                    </label>

                    <label>
                        Telefone / WhatsApp
                        <input
                            type="text"
                            value={cliente.telefone}
                            onChange={(e) =>
                                alterarCampo("telefone", mascaraTelefone(e.target.value))
                            }
                        />
                    </label>

                    <label>
                        Status
                        <select
                            value={cliente.status}
                            onChange={(e) => alterarCampo("status", e.target.value)}
                        >
                            <option>Ativo</option>
                            <option>Inativo</option>
                        </select>
                    </label>
                </div>
            </div>

            <div className="form-card">
                <h2>Endereço</h2>

                <div className="form-grid">
                    <label>
                        País
                        <select
                            value={cliente.pais}
                            onChange={(e) => alterarCampo("pais", e.target.value)}
                        >
                            <option>Brasil</option>
                            <option>Estados Unidos</option>
                            <option>Alemanha</option>
                            <option>Itália</option>
                            <option>Japão</option>
                            <option>Colômbia</option>
                            <option>Guatemala</option>
                        </select>
                    </label>

                    <label>
                        Estado
                        <input
                            type="text"
                            value={cliente.estado}
                            onChange={(e) => alterarCampo("estado", e.target.value)}
                        />
                    </label>

                    <label>
                        Cidade
                        <input
                            type="text"
                            value={cliente.cidade}
                            onChange={(e) => alterarCampo("cidade", e.target.value)}
                        />
                    </label>

                    <label>
                        CEP
                        <input
                            type="text"
                            value={cliente.cep}
                            onChange={(e) =>
                                alterarCampo("cep", mascaraCep(e.target.value))
                            }
                        />
                    </label>

                    <label>
                        Endereço
                        <input
                            type="text"
                            value={cliente.endereco}
                            onChange={(e) => alterarCampo("endereco", e.target.value)}
                        />
                    </label>

                    <label>
                        Número
                        <input
                            type="text"
                            value={cliente.numero}
                            onChange={(e) => alterarCampo("numero", e.target.value)}
                        />
                    </label>

                    <label>
                        Complemento
                        <input
                            type="text"
                            value={cliente.complemento}
                            onChange={(e) => alterarCampo("complemento", e.target.value)}
                        />
                    </label>

                    <label>
                        Bairro
                        <input
                            type="text"
                            value={cliente.bairro}
                            onChange={(e) => alterarCampo("bairro", e.target.value)}
                        />
                    </label>
                </div>
            </div>

            <div className="form-card">
                <h2>Informações comerciais</h2>

                <div className="form-grid">
                    <label>
                        Tipo de cliente
                        <select
                            value={cliente.tipoCliente}
                            onChange={(e) => alterarCampo("tipoCliente", e.target.value)}
                        >
                            <option>Comprador</option>
                            <option>Exportador</option>
                            <option>Torrefação</option>
                            <option>Corretora</option>
                            <option>Cooperativa</option>
                            <option>Produtor</option>
                        </select>
                    </label>

                    <label>
                        Moeda preferencial
                        <select
                            value={cliente.moedaPreferencial}
                            onChange={(e) =>
                                alterarCampo("moedaPreferencial", e.target.value)
                            }
                        >
                            <option>BRL</option>
                            <option>USD</option>
                            <option>EUR</option>
                        </select>
                    </label>

                    <label>
                        Idioma preferencial
                        <select
                            value={cliente.idiomaPreferencial}
                            onChange={(e) =>
                                alterarCampo("idiomaPreferencial", e.target.value)
                            }
                        >
                            <option>Português</option>
                            <option>Inglês</option>
                            <option>Espanhol</option>
                        </select>
                    </label>

                    <label>
                        Grupo de acesso
                        <select
                            value={cliente.grupoAcesso || "consulta"}
                            onChange={(e) =>
                                alterarCampo("grupoAcesso", e.target.value)
                            }
                        >
                            <option value="consulta">Consulta</option>
                            <option value="comprador">Comprador</option>
                            <option value="comercial">Comercial</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </label>
                    <label className="checkbox-field">
                        <input
                            type="checkbox"
                            checked={cliente.ativoPortal || false}
                            onChange={(e) =>
                                alterarCampo("ativoPortal", e.target.checked)
                            }
                        />
                        Permitir acesso ao portal
                    </label>
                </div>
            </div>

            <div className="form-card">
                <h2>Contato principal</h2>

                <div className="form-grid">
                    <label>
                        Nome do contato
                        <input
                            type="text"
                            value={cliente.nomeContato}
                            onChange={(e) => alterarCampo("nomeContato", e.target.value)}
                        />
                    </label>

                    <label>
                        Cargo
                        <input
                            type="text"
                            value={cliente.cargoContato}
                            onChange={(e) => alterarCampo("cargoContato", e.target.value)}
                        />
                    </label>

                    <label>
                        Telefone
                        <input
                            type="text"
                            value={cliente.telefoneContato}
                            onChange={(e) =>
                                alterarCampo(
                                    "telefoneContato",
                                    mascaraTelefone(e.target.value)
                                )
                            }
                        />
                    </label>

                    <label>
                        E-mail
                        <input
                            type="email"
                            value={cliente.emailContato}
                            onChange={(e) => alterarCampo("emailContato", e.target.value)}
                        />
                    </label>
                </div>
            </div>

            <div className="form-card">
                <h2>Observações</h2>

                <label>
                    Observações internas
                    <textarea
                        rows="4"
                        value={cliente.observacoes}
                        onChange={(e) => alterarCampo("observacoes", e.target.value)}
                    />
                </label>
            </div>
        </section>
    );
}