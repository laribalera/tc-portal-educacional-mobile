import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import { getToken, setToken as saveToken, clearToken } from "../storage/token";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);

  // pode ser 1 ou outro
  const [professor, setProfessor] = useState(null);
  const [aluno, setAluno] = useState(null);

  const [role, setRole] = useState(null); // "professor" | "aluno" | "admin"(se quiser)
  const [loadingAuth, setLoadingAuth] = useState(true);

  function applyAuthHeader(t) {
    if (t) api.defaults.headers.common.Authorization = `Bearer ${t}`;
    else delete api.defaults.headers.common.Authorization;
  }

  async function logoutAndClear() {
    await clearToken();
    setToken(null);
    setProfessor(null);
    setAluno(null);
    setRole(null);
    applyAuthHeader(null);
  }

  async function tryMeProfessor() {
    const me = await api.get("/api/professores/me");
    const prof = me.data?.professor ?? me.data;
    setProfessor(prof);
    setAluno(null);

    const r = prof?.role === "admin" ? "admin" : "professor";
    setRole(r);

    return prof;
  }

  async function tryMeAluno() {
    const me = await api.get("/api/alunos/me");
    const a = me.data?.aluno ?? me.data;
    setAluno(a);
    setProfessor(null);
    setRole("aluno");
    return a;
  }

  async function bootstrap() {
    try {
      setLoadingAuth(true);

      const t = await getToken();
      setToken(t);
      applyAuthHeader(t);

      if (!t) {
        setProfessor(null);
        setAluno(null);
        setRole(null);
        return;
      }

      // tenta professor primeiro
      try {
        await tryMeProfessor();
        return;
      } catch (e1) {
        // tenta aluno
        try {
          await tryMeAluno();
          return;
        } catch (e2) {
          console.log(
            "bootstrap fail:",
            e2?.response?.status,
            e2?.response?.data || e2?.message
          );
          await logoutAndClear();
        }
      }
    } finally {
      setLoadingAuth(false);
    }
  }

  useEffect(() => {
    bootstrap();
  }, []);

  // --- LOGINS ---
  async function signInProfessor(email, password) {
    const { data } = await api.post("/api/professores/login", { email, password });

    await saveToken(data.token);
    setToken(data.token);
    applyAuthHeader(data.token);

    if (data.professor) {
      setProfessor(data.professor);
      setAluno(null);
      const r = data.professor?.role === "admin" ? "admin" : "professor";
      setRole(r);
    } else {
      await tryMeProfessor();
    }
  }

  async function signInAluno(email, password) {
    const { data } = await api.post("/api/alunos/login", { email, password });

    await saveToken(data.token);
    setToken(data.token);
    applyAuthHeader(data.token);

    if (data.aluno) {
      setAluno(data.aluno);
      setProfessor(null);
      setRole("aluno");
    } else {
      await tryMeAluno();
    }
  }

  async function signOut() {
    await logoutAndClear();
  }

  const value = useMemo(
    () => ({
      token,
      professor,
      aluno,
      role,
      isLogged: !!token,
      loadingAuth,

      // helpers
      isStudent: role === "aluno",
      isProfessor: role === "professor" || role === "admin",
      isAdmin: role === "admin",

      // actions
      signInProfessor,
      signInAluno,
      signOut,
      refresh: bootstrap,
    }),
    [token, professor, aluno, role, loadingAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro do AuthProvider");
  return ctx;
}
