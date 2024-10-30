import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { api } from '../services/api';

interface User {
  id: number;
  nome: string;
  apelido: string;
  email: string;
  foto?: string;
  cidade: string;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = Cookies.get('friends.token');
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      api.get('/usuarios/me').then(response => {
        setUser(response.data);
      });
    }
  }, []);

  async function signIn(email: string, password: string) {
    try {
      const response = await api.post('/auth/login', {
        email,
        senha: password,
      });

      const { token, user } = response.data;

      Cookies.set('friends.token', token, { expires: 30 });
      api.defaults.headers.Authorization = `Bearer ${token}`;

      setUser(user);
    } catch (error) {
      throw new Error('Failed to sign in');
    }
  }

  function signOut() {
    Cookies.remove('friends.token');
    setUser(null);
    delete api.defaults.headers.Authorization;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);