import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const USUARIO_TESTE = {
    email: "comercial@cafeonline.com",
    senha: "cafe2026"
};

export function AuthProvider({ children }) {
    const [authenticated, setAuthenticated] = useState(
        sessionStorage.getItem("auth")
    );

function login(email, senha) {
    if (email === "comercial@cafeonline.com" && senha === "cafe2026") {
        sessionStorage.setItem("auth", "true");
        setAuthenticated(true);
        return true;
    }

    return false;
}

    function logout() {
        localStorage.removeItem("auth");
        setAuthenticated(false);
    }

    return (
        <AuthContext.Provider
            value={{
                authenticated,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}