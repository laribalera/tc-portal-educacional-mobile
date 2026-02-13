import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import { getToken, setToken as saveToken, clearToken } from "../storage/token";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [professor, setProfessor] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  async function bootstrap() {
    try {
      setLoadingAuth(true);

      const t = await getToken();
      setToken(t);

      if (t) {
        try {
          const me = await api.get("/api/professores/me");
          console.log("ME bootstrap:", me.status, me.data);

          // suporta { professor: {...} } ou {...}
          const prof = me.data?.professor ?? me.data;
          setProfessor(prof);
        } catch (e) {
          console.log(
            "ME bootstrap FAIL:",
            e?.response?.status,
            e?.response?.data || e?.message
          );

          // token inválido/expirado
          await clearToken();
          setToken(null);
          setProfessor(null);
        }
      } else {
        setProfessor(null);
      }
    } finally {
      setLoadingAuth(false);
    }
  }

  useEffect(() => {
    bootstrap();
  }, []);

  async function signIn(email, password) {
    const { data } = await api.post("/api/professores/login", { email, password });

    await saveToken(data.token);
    setToken(data.token);

    // se o login já retorna professor, usa. se não, chama /me
    if (data.professor) {
      setProfessor(data.professor);
    } else {
      const me = await api.get("/api/professores/me");
      console.log("ME signIn:", me.status, me.data);

      const prof = me.data?.professor ?? me.data;
      setProfessor(prof);
    }
  }

  async function signOut() {
    await clearToken();
    setToken(null);
    setProfessor(null);
  }

  const value = useMemo(
    () => ({
      token,
      professor,
      isLogged: !!token,
      loadingAuth,
      signIn,
      signOut,
      refresh: bootstrap,
    }),
    [token, professor, loadingAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro do AuthProvider");
  return ctx;
}
