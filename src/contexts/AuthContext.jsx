import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Checa se já existe um token salvo para manter o usuário logado ao recarregar a página
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("access_token"),
  );

  const login = async (username, password) => {
    try {
      // Faz o POST para a rota JWT do Django
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/token/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        },
      );

      if (response.ok) {
        const data = await response.json();

        // Salva os tokens no navegador
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);

        setIsAuthenticated(true);
        return true; // Login bem-sucedido
      }

      return false; // Usuário ou senha incorretos
    } catch (error) {
      console.error("Erro ao conectar com o servidor de autenticação:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
