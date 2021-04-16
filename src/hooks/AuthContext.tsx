/* eslint-disable spaced-comment */
/* eslint-disable camelcase */
import React, {
  createContext, useCallback, useContext, useState,
} from 'react';
import api from '../services/api';

interface AuthState {
    token: string;
    user: object;

}
interface AuthState2 {
    cadastro: object;
}

interface SignInCredentials {
    email: string;
    password: string;
}

interface CadastrarCredentials {
    disciplina: string;
    professor: string;
    dia_semana: string;
    periodo: string;
    horario: string;
}

interface AuthContextData {
    user: object;
    cadastro: object;
    signIn(credentials: SignInCredentials): Promise<void>;
    cadastrar(credentials: CadastrarCredentials): Promise<void>;
    signOut(): void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@GoBarber:token');
    const user = localStorage.getItem('@GoBarber:user');

    if (token && user) {
      return { token, user: JSON.parse(user) };
    }
    return {} as AuthState;
  });
  const [data2] = useState<AuthState2>(() => {
    const cadastro = localStorage.getItem('@GoBarber:cadastro');
    if (cadastro) {
      return { cadastro: JSON.parse(cadastro) };
    }
    return {} as AuthState2;
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });
    const { token, user } = response.data;

    localStorage.setItem('@GoBarber:token', token);
    localStorage.setItem('@GoBarber:user', JSON.stringify(user));

    setData({ token, user });
  }, []);

  const cadastrar = useCallback(async ({
    disciplina, professor, dia_semana, periodo, horario,
  }) => {
    const response = {
      disciplina,
      professor,
      dia_semana,
      periodo,
      horario,
    };

    // const { a } = response.data;

    localStorage.setItem('@GoBarber:cadastro', JSON.stringify(response));

    // setData2({ response });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@GoBarber:token');
    localStorage.removeItem('@GoBarber:user');
    setData({} as AuthState);
  }, []);
  return (
    <AuthContext.Provider value={{
      user: data.user, signIn, signOut, cadastrar, cadastro: data2.cadastro,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
export default AuthContext;
