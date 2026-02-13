import React, { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, Alert, StyleSheet } from "react-native";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import LoadingCenter from "../components/LoadingCenter";

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

  // enquanto o auth carrega, mostra loader
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

      if (mode === "edit" && existing?._id) {
        await api.put(`/api/posts/${existing._id}`, payload);
      } else {
        await api.post("/api/posts", payload);
        let res;

        if (mode === "edit" && existing?._id) {
          res = await api.put(`/api/posts/${existing._id}`, payload);
        } else {
          res = await api.post("/api/posts", payload);
        }

        console.log("SAVE OK:", res?.status, res?.data);
        Alert.alert("Sucesso", "Post salvo!");
        navigation.goBack();

      }

      navigation.goBack();
    } catch (e) {
      console.log("Erro save:", e?.response?.data || e?.message);
      Alert.alert("Erro", "Não consegui salvar o post.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Professor</Text>
      <TextInput
        value={professor?.name || professor?.email || ""}
        editable={false}
        style={[styles.input, styles.disabledInput]}
      />

      <Text style={styles.label}>Título</Text>
      <TextInput value={titulo} onChangeText={setTitulo} style={styles.input} />

      <Text style={styles.label}>Matéria</Text>
      <TextInput value={materia} onChangeText={setMateria} style={styles.input} />

      <Text style={styles.label}>Tags (separadas por vírgula)</Text>
      <TextInput value={tagsText} onChangeText={setTagsText} style={styles.input} />

      <Text style={styles.label}>Conteúdo</Text>
      <TextInput
        value={conteudo}
        onChangeText={setConteudo}
        style={[styles.input, styles.textarea]}
        multiline
      />

      <Pressable onPress={handleSave} style={styles.primaryBtn} disabled={saving}>
        <Text style={styles.primaryBtnText}>{saving ? "Salvando..." : "Salvar"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F3F4F6",
    gap: 10,
  },
  label: {
    fontWeight: "700",
    color: "#111827",
    marginTop: 6,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  disabledInput: {
    backgroundColor: "#E5E7EB",
    color: "#6B7280",
  },
  textarea: {
    height: 180,
    textAlignVertical: "top",
  },
  primaryBtn: {
    marginTop: 12,
    backgroundColor: "#111827",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "800",
  },
});
