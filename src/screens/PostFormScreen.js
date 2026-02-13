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
import { useAuth } from "../context/AuthContext";
import LoadingCenter from "../components/LoadingCenter";
import { colors, typography } from "../theme";

export default function PostFormScreen({ route, navigation }) {
  const { professor, loadingAuth } = useAuth();

  const mode = route?.params?.mode || "create";
  const existing = route?.params?.post || null;

  const initial = useMemo(
    () => ({
      titulo: existing?.titulo || "",
      conteudo: existing?.conteudo || "",
      materia: existing?.materia || "",
      tagsText: (existing?.tags || []).join(", "),
    }),
    [existing]
  );

  const [titulo, setTitulo] = useState(initial.titulo);
  const [conteudo, setConteudo] = useState(initial.conteudo);
  const [materia, setMateria] = useState(initial.materia);
  const [tagsText, setTagsText] = useState(initial.tagsText);
  const [saving, setSaving] = useState(false);

  if (loadingAuth) return <LoadingCenter />;

  async function handleSave() {
    try {
      setSaving(true);

      const tags = tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const professorId = professor?._id || professor?.id;

      if (!professorId) {
        Alert.alert("Erro", "Professor não identificado. Faça login novamente.");
        return;
      }

      const payload = {
        titulo,
        conteudo,
        materia,
        tags,
        autor: professorId,
      };

      let res;
      if (mode === "edit" && existing?._id) {
        res = await api.put(`/api/posts/${existing._id}`, payload);
      } else {
        res = await api.post("/api/posts", payload);
      }

      console.log("SAVE OK:", res?.status, res?.data);
      Alert.alert("Sucesso", "Post salvo!");
      navigation.goBack();
    } catch (e) {
      console.log("Erro save:", e?.response?.data || e?.message);
      Alert.alert("Erro", "Não foi possível salvar o post.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* Header mini */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
          <Text style={styles.backText}>Voltar</Text>
        </Pressable>

        <Text style={styles.headerTitle}>
          {mode === "edit" ? "Editar post" : "Novo post"}
        </Text>

        <View style={{ width: 72 }} />
      </View>

      {/* Card do form */}
      <View style={styles.card}>
        <Text style={styles.label}>Professor</Text>
        <TextInput
          value={professor?.name || professor?.email || ""}
          editable={false}
          style={[styles.input, styles.disabledInput]}
        />

        <Text style={styles.label}>Título</Text>
        <TextInput
          value={titulo}
          onChangeText={setTitulo}
          style={styles.input}
          placeholder="Digite o título"
          placeholderTextColor={colors.muted}
        />

        <Text style={styles.label}>Disciplina</Text>
        <TextInput
          value={materia}
          onChangeText={setMateria}
          style={styles.input}
          placeholderTextColor={colors.muted}
        />

        <Text style={styles.label}>Tags (separadas por vírgula)</Text>
        <TextInput
          value={tagsText}
          onChangeText={setTagsText}
          style={styles.input}
          placeholderTextColor={colors.muted}
        />

        <Text style={styles.label}>Conteúdo</Text>
        <TextInput
          value={conteudo}
          onChangeText={setConteudo}
          style={[styles.input, styles.textarea]}
          multiline
          placeholder="Escreva o conteúdo do post..."
          placeholderTextColor={colors.muted}
        />

        <Pressable
          onPress={handleSave}
          style={[styles.primaryBtn, saving && { opacity: 0.8 }]}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
              <Text style={styles.primaryBtnText}>Salvar</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    width: 72,
  },
  backText: {
    color: colors.text,
    fontSize: 14,
    ...typography.bold,
  },
  headerTitle: {
    color: colors.muted,
    fontSize: 14,
    ...typography.bold,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    gap: 10,
  },

  label: {
    marginTop: 2,
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

  disabledInput: {
    backgroundColor: "#E5E7EB",
    color: colors.muted,
  },

  textarea: {
    height: 180,
    textAlignVertical: "top",
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
});
