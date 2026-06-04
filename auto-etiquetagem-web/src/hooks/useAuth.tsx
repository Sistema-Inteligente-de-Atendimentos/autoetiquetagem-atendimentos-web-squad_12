import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getToken, setToken, clearToken, getMe, login as apiLogin, register as apiRegister, type Usuario } from '../services/api';

type AuthContextType = {
  usuario: Usuario | null;
  carregando: boolean;
  login: (email: string, senha: string) => Promise<void>;
  register: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      if (!getToken()) {
        setCarregando(false);
        return;
      }
      try {
        setUsuario(await getMe());
      } catch {
        clearToken();
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  async function login(email: string, senha: string) {
    const { token, usuario } = await apiLogin(email, senha);
    setToken(token);
    setUsuario(usuario);
  }

  async function register(nome: string, email: string, senha: string) {
    const { token, usuario } = await apiRegister(nome, email, senha);
    setToken(token);
    setUsuario(usuario);
  }

  function logout() {
    clearToken();
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
