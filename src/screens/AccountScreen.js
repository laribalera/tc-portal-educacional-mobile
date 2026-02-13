import React from "react";
import { View, Text, Pressable, Alert, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../context/AuthContext";
import { colors, typography } from "../theme";

export default function AccountScreen() {
  const { isLogged, signOut, role, professor, aluno, isAdmin } = useAuth();

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

  if (!isLogged) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Você não está logada</Text>
          <Text style={styles.sub}>Faça login para acessar sua conta.</Text>

          <View style={styles.tip}>
            <Ionicons name="information-circle-outline" size={18} color={colors.muted} />
            <Text style={styles.tipText}>
              Volte para a tela de Login para entrar.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  const user = role === "aluno" ? aluno : professor;

  const nome = user?.name || (role === "aluno" ? "Aluno(a)" : "Professor(a)");
  const email = user?.email || "";
  const disciplinas = user?.disciplinas?.join(", ") || "Nenhuma disciplina";

  const isStudent = role === "aluno";

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Header simples */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Ionicons
              name={isStudent ? "person-outline" : "school-outline"}
              size={16}
              color={colors.accent}
            />
            <Text style={styles.badgeText}>
              {isStudent ? "Aluno" : "Professor"}
            </Text>
          </View>

          {(!isStudent && isAdmin) ? (
            <View style={[styles.badge, { borderColor: colors.accent }]}>
              <Ionicons name="shield-checkmark-outline" size={16} color={colors.accent} />
              <Text style={styles.badgeText}>Admin</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.line}>
          <Text style={styles.label}>Nome</Text>
          <Text style={styles.value}>{nome}</Text>
        </View>

        {!!email && (
          <View style={styles.line}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{email}</Text>
          </View>
        )}

        <View style={styles.line}>
          <Text style={styles.label}>Disciplinas</Text>
          <Text style={styles.value}>{disciplinas}</Text>
        </View>

        {/* Só profs vê essa info */}
        {!isStudent ? (
          <View style={styles.line}>
            <Text style={styles.label}>É Administrador</Text>
            <Text style={styles.value}>{isAdmin ? "Sim" : "Não"}</Text>
          </View>
        ) : null}

        <Pressable onPress={handleLogout} style={styles.dangerBtn}>
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.dangerBtnText}>Sair</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: colors.background },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    gap: 12,
  },

  title: { fontSize: 18, color: colors.text, ...typography.title },
  sub: { color: colors.muted, ...typography.body },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border ?? "#E5E7EB",
    backgroundColor: colors.surface,
  },
  badgeText: {
    color: colors.accent,
    ...typography.bold,
    fontSize: 12,
  },

  line: { gap: 4, marginTop: 4 },
  label: { color: colors.muted, fontSize: 12, ...typography.bold },
  value: { color: colors.text, fontSize: 14, ...typography.body },

  tip: {
    marginTop: 8,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border ?? "#E5E7EB",
    backgroundColor: colors.surface,
  },
  tipText: {
    flex: 1,
    color: colors.muted,
    ...typography.body,
    fontSize: 13,
  },

  dangerBtn: {
    marginTop: 10,
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
  dangerBtnText: { color: colors.danger, fontSize: 16, ...typography.bold },
});
