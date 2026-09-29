import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Checa se já existe um token salvo para manter o usuário logado ao recarregar a página
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("access_token"),
  );

  // NOVO: Estado para armazenar os dados do usuário, puxando do localStorage caso ele atualize a página
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

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

        // NOVO: Salva os dados do usuário retornados pela API (que nós configuramos no Django)
        const userData = {
          username: data.username,
          first_name: data.first_name,
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

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

    // NOVO: Remove os dados do usuário ao deslogar
    localStorage.removeItem("user");
    setUser(null);

    setIsAuthenticated(false);
  };

  return (
    // NOVO: Incluindo a variável 'user' dentro do value do Provider para que os componentes possam acessá-la
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
