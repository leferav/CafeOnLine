import { createContext, useContext, useState } from "react";
import { listarClientes } from "../pages/Cadastro/Cliente/clientesStorage";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(() => {
        const dados = localStorage.getItem("cafe_online_usuario");
        return dados ? JSON.parse(dados) : null;
    });

    function login(email, documento) {
        const clientes = listarClientes();

        const cliente = clientes.find(
            (c) =>
                c.email?.toLowerCase() === email.toLowerCase() &&
                c.documento === documento &&
                c.ativoPortal === true
        );

        if (!cliente) {
            return false;
        }

        const usuarioLogado = {
            id: cliente.id,
            nome: cliente.nomeRazaoSocial,
            email: cliente.email,
            grupoAcesso: cliente.grupoAcesso || "consulta",
        };

        localStorage.setItem("cafe_online_usuario", JSON.stringify(usuarioLogado));
        setUsuario(usuarioLogado);

        return true;
    }

    function logout() {
        localStorage.removeItem("cafe_online_usuario");
        setUsuario(null);

        window.location.href = "/login";
    }

    return (
        <AuthContext.Provider value={{ usuario, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}