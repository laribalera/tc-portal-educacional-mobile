import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { api } from "../services/api";
import { colors, typography } from "../theme";

export default function ProfessorFormScreen({ route, navigation }) {
  const mode = route?.params?.mode || "create";
  const existing = route?.params?.professor || null;

  const initial = useMemo(
    () => ({
      name: existing?.name || "",
      email: existing?.email || "",
      password: "",
      disciplinasText: (existing?.disciplinas || []).join(", "),
    }),
    [existing]
  );

  const [name, setName] = useState(initial.name);
  const [email, setEmail] = useState(initial.email);
  const [password, setPassword] = useState(initial.password);
  const [disciplinasText, setDisciplinasText] = useState(initial.disciplinasText);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    try {
      setSaving(true);

      if (!name.trim()) {
        Alert.alert("Validação", "Nome é obrigatório.");
        return;
      }
      if (!email.trim()) {
        Alert.alert("Validação", "Email é obrigatório.");
        return;
      }

      const disciplinas = disciplinasText
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean);

      if (mode === "create") {
        if (!password.trim()) {
          Alert.alert("Validação", "Senha é obrigatória para criar professor.");
          return;
        }

        await api.post("/api/professores", { name, email, password, disciplinas });
      } else {
        const id = existing?._id || existing?.id;
        const payload = { name, email, disciplinas };
        if (password.trim()) payload.password = password;

        await api.put(`/api/professores/${id}`, payload);
      }

      Alert.alert("Sucesso", mode === "create" ? "Professor criado!" : "Professor atualizado!");
      navigation.goBack();
    } catch (e) {
      console.log("Erro salvar professor:", e?.response?.data || e?.message);
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        "Não consegui salvar o professor.";
      Alert.alert("Erro", msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholder="Nome do professor"
          placeholderTextColor={colors.muted}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          placeholder="email@exemplo.com"
          placeholderTextColor={colors.muted}
        />

        <Text style={styles.label}>Disciplinas (separadas por vírgula)</Text>
        <TextInput
          value={disciplinasText}
          onChangeText={setDisciplinasText}
          style={styles.input}
          placeholder="Ex: Física, Matemática"
          placeholderTextColor={colors.muted}
        />

        <Text style={styles.label}>
          {mode === "create" ? "Senha" : "Senha (opcional)"}
        </Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          placeholder={mode === "create" ? "Crie uma senha" : "Deixe vazio para manter"}
          placeholderTextColor={colors.muted}
        />

        <Pressable onPress={handleSave} style={styles.primaryBtn} disabled={saving}>
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
              <Text style={styles.primaryBtnText}>
                {mode === "create" ? "Criar" : "Salvar"}
              </Text>
            </>
          )}
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
    gap: 10,
  },

  label: { color: colors.text, fontSize: 13, ...typography.bold },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border ?? "#E5E7EB",
    color: colors.text,
    ...typography.body,
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
  primaryBtnText: { color: "#fff", fontSize: 16, ...typography.bold },
});
