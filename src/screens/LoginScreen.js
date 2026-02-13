import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../context/AuthContext";
import { colors, typography } from "../theme";

export default function LoginScreen({ navigation }) {
  const {
    signInProfessor,
    signInAluno,
    isLogged,
    signOut,
    professor,
    aluno,
    role,
    isAdmin,
    isStudent,
  } = useAuth();

  // "professor" | "aluno"
  const [loginAs, setLoginAs] = useState("professor");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      String(email).trim().length > 0 &&
      String(password).trim().length > 0 &&
      !loading
    );
  }, [email, password, loading]);

  async function handleLogin() {
    try {
      setLoading(true);

      if (loginAs === "aluno") {
        await signInAluno(email, password);
      } else {
        await signInProfessor(email, password);
      }

    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Erro no login";
      Alert.alert("Login", msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    Alert.alert("Sair", "Deseja sair da conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  }

  // --------- LOGADO ----------
  if (isLogged) {
    const nome =
      professor?.name || aluno?.name || "";
    const emailUser =
      professor?.email || aluno?.email || "";

    const tipo =
      role === "aluno" ? "Aluno(a)" : "Professor(a)";

    return (
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Ionicons
              name="checkmark-circle-outline"
              size={22}
              color={colors.accent}
            />
            <Text style={styles.title}>Você já está logada</Text>
          </View>

          <Text style={styles.sub}>
            {tipo}{nome ? `: ${nome}` : ""}{emailUser ? ` • ${emailUser}` : ""}
          </Text>

          <View style={{ height: 6 }} />

          <Pressable
            onPress={() => navigation.navigate("PostsTab")}
            style={styles.primaryBtn}
          >
            <Ionicons name="document-text-outline" size={20} color="#fff" />
            <Text style={styles.primaryBtnText}>Ir para Posts</Text>
          </Pressable>

          {/* Só professor (não aluno) pode ver Admin */}
          {!isStudent && isAdmin ? (
            <Pressable
              onPress={() => navigation.navigate("AdminTab")}
              style={styles.secondaryBtn}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={colors.accent}
              />
              <Text style={styles.secondaryBtnText}>Ir para Admin</Text>
            </Pressable>
          ) : null}

          <Pressable onPress={handleLogout} style={styles.dangerBtn}>
            <Ionicons name="log-out-outline" size={20} color={colors.danger} />
            <Text style={styles.dangerBtnText}>Sair</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  // --------- DESLOGADO ----------
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <Text style={styles.brand}>Portal Educacional</Text>

        {/* Toggle Professor/Aluno */}
        <View style={styles.segment}>
          <Pressable
            onPress={() => setLoginAs("professor")}
            style={[
              styles.segmentBtn,
              loginAs === "professor" && styles.segmentBtnActive,
            ]}
          >
            <Ionicons
              name="school-outline"
              size={18}
              color={loginAs === "professor" ? "#fff" : colors.muted}
            />
            <Text
              style={[
                styles.segmentText,
                loginAs === "professor" && styles.segmentTextActive,
              ]}
            >
              Professor
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setLoginAs("aluno")}
            style={[
              styles.segmentBtn,
              loginAs === "aluno" && styles.segmentBtnActive,
            ]}
          >
            <Ionicons
              name="person-outline"
              size={18}
              color={loginAs === "aluno" ? "#fff" : colors.muted}
            />
            <Text
              style={[
                styles.segmentText,
                loginAs === "aluno" && styles.segmentTextActive,
              ]}
            >
              Aluno
            </Text>
          </Pressable>
        </View>

        <Text style={styles.label}>Email</Text>
        <View style={styles.inputRow}>
          <Ionicons name="mail-outline" size={18} color={colors.muted} />
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="email@exemplo.com"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
        </View>

        <Text style={styles.label}>Senha</Text>
        <View style={styles.inputRow}>
          <Ionicons name="lock-closed-outline" size={18} color={colors.muted} />
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Sua senha"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
        </View>

        <Pressable
          onPress={handleLogin}
          style={[styles.primaryBtn, !canSubmit && { opacity: 0.6 }]}
          disabled={!canSubmit}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="log-in-outline" size={20} color="#fff" />
              <Text style={styles.primaryBtnText}>
                Entrar como {loginAs === "aluno" ? "Aluno" : "Professor"}
              </Text>
            </>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: colors.background,
    justifyContent: "center",
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    gap: 10,
  },

  headerRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },

  brand: {
    fontSize: 22,
    textAlign: "center",
    color: colors.accent,
    ...typography.h1,
  },

  title: {
    fontSize: 18,
    color: colors.text,
    ...typography.h1,
  },

  sub: {
    color: colors.muted,
    ...typography.body,
  },

  label: {
    marginTop: 6,
    color: colors.text,
    fontSize: 13,
    ...typography.bold,
  },

  inputRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border ?? "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    color: colors.text,
    ...typography.body,
    paddingVertical: 2,
  },

  primaryBtn: {
    marginTop: 10,
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    ...typography.bold,
  },

  secondaryBtn: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border ?? "#E5E7EB",
    backgroundColor: colors.surface,
  },
  secondaryBtnText: {
    color: colors.accent,
    fontSize: 16,
    ...typography.bold,
  },

  dangerBtn: {
    marginTop: 8,
    backgroundColor: "#FEE2E2",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  dangerBtnText: {
    color: colors.danger,
    fontSize: 16,
    ...typography.bold,
  },

  // segment
  segment: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.border ?? "#E5E7EB",
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  segmentBtnActive: {
    backgroundColor: colors.accent,
  },
  segmentText: {
    color: colors.muted,
    ...typography.bold,
  },
  segmentTextActive: {
    color: "#fff",
  },
});
