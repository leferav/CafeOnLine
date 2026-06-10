const STORAGE_KEY = "cafe_online_clientes";

export function listarClientes() {
    const dados = localStorage.getItem(STORAGE_KEY);
    return dados ? JSON.parse(dados) : [];
}

export function buscarClientePorId(id) {
    return listarClientes().find((cliente) => cliente.id === id);
}

export function salvarCliente(cliente) {
    const clientes = listarClientes();

    if (cliente.id) {
        const atualizados = clientes.map((item) =>
            item.id === cliente.id ? cliente : item
        );

        localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizados));
        return cliente;
    }

    const novoCliente = {
        ...cliente,
        id: crypto.randomUUID(),
        dataCadastro: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify([...clientes, novoCliente]));
    return novoCliente;
}

export function excluirCliente(id) {
    const clientes = listarClientes();

    const atualizados = clientes.filter(
        (cliente) => cliente.id !== id
    );

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(atualizados)
    );
}