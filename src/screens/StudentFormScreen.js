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

export default function StudentFormScreen({ route, navigation }) {
  const mode = route?.params?.mode || "create";
  const existing = route?.params?.student || null;

  const initial = useMemo(() => {
    return {
      name: existing?.name || "",
      email: existing?.email || "",
      disciplinasText: Array.isArray(existing?.disciplinas)
        ? existing.disciplinas.join(", ")
        : "",
      senha: "",
    };
  }, [existing]);

  const [name, setName] = useState(initial.name);
  const [email, setEmail] = useState(initial.email);
  const [disciplinasText, setDisciplinasText] = useState(initial.disciplinasText);
  const [senha, setSenha] = useState(initial.senha);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    try {
      setSaving(true);

      const cleanName = String(name || "").trim();
      const cleanEmail = String(email || "").trim();

      if (!cleanName) {
        Alert.alert("Validação", "Nome é obrigatório.");
        return;
      }

      if (!cleanEmail) {
        Alert.alert("Validação", "Email é obrigatório.");
        return;
      }

      const disciplinas = String(disciplinasText || "")
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean);

      if (disciplinas.length === 0) {
        Alert.alert("Validação", "Informe pelo menos 1 disciplina.");
        return;
      }

      // CREATE
      if (mode === "create") {
        const cleanSenha = String(senha || "").trim();
        if (!cleanSenha) {
          Alert.alert("Validação", "Senha é obrigatória para criar aluno.");
          return;
        }

        const payload = {
          name: cleanName,
          email: cleanEmail,
          disciplinas,
          senha: cleanSenha, // backend espera "senha"
        };

        const res = await api.post("/api/alunos", payload);
        console.log("CREATE ALUNO OK:", res?.status, res?.data);

        Alert.alert("Sucesso", "Aluno criado!");
        navigation.goBack();
        return;
      }

      // EDIT
      const id = existing?._id || existing?.id;
      if (!id) {
        Alert.alert("Erro", "Aluno inválido para edição.");
        return;
      }

      const payload = {
        name: cleanName,
        email: cleanEmail,
        disciplinas,
      };

      // senha opcional no edit
      const cleanSenha = String(senha || "").trim();
      if (cleanSenha) payload.senha = cleanSenha;

      const res = await api.put(`/api/alunos/${id}`, payload);
      console.log("UPDATE ALUNO OK:", res?.status, res?.data);

      Alert.alert("Sucesso", "Aluno atualizado!");
      navigation.goBack();
    } catch (e) {
      console.log("Erro salvar aluno:", e?.response?.data || e?.message);
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        "Não consegui salvar o aluno.";
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
          placeholder="Nome do aluno"
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
          placeholder="Ex: Matemática, Física"
          placeholderTextColor={colors.muted}
        />

        <Text style={styles.label}>
          {mode === "create" ? "Senha" : "Senha (opcional)"}
        </Text>
        <TextInput
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          style={styles.input}
          placeholder={mode === "create" ? "Crie uma senha" : "Deixe vazio para manter"}
          placeholderTextColor={colors.muted}
        />

        <Pressable
          onPress={handleSave}
          style={[styles.primaryBtn, saving && { opacity: 0.7 }]}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
              <Text style={styles.primaryBtnText}>
                {mode === "create" ? "Criar aluno" : "Salvar alterações"}
              </Text>
            </>
          )}
        </Pressable>

        <Pressable onPress={() => navigation.goBack()} style={styles.ghostBtn}>
          <Text style={styles.ghostBtnText}>Cancelar</Text>
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

  label: {
    color: colors.text,
    fontSize: 13,
    ...typography.bold,
  },

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

  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    ...typography.bold,
  },

  ghostBtn: {
    marginTop: 6,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border ?? "#E5E7EB",
    backgroundColor: colors.surface,
  },

  ghostBtnText: {
    color: colors.text,
    ...typography.bold,
  },
});
