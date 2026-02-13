import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import { api } from "../services/api";
import { colors, typography } from "../theme";

export default function StudentsListScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);

  const PAGE_SIZE = 8;
  const [page, setPage] = useState(1);

  async function load() {
    try {
      setLoading(true);

      const res = await api.get("/api/alunos");
      const raw = res?.data;
      const list = Array.isArray(raw) ? raw : [];

      setStudents(list);
      setPage(1);
    } catch (e) {
      console.log("Erro alunos:", e?.response?.data || e?.message);
      Alert.alert("Erro", "Não consegui carregar os alunos.");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const visible = useMemo(
    () => students.slice(0, page * PAGE_SIZE),
    [students, page]
  );

  const canLoadMore = visible.length < students.length;

  async function handleDelete(id) {
    Alert.alert("Excluir", "Tem certeza que deseja excluir este aluno?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/api/alunos/${id}`);
            await load();
          } catch (e) {
            console.log("Erro delete aluno:", e?.response?.data || e?.message);
            Alert.alert("Erro", "Não consegui excluir o aluno.");
          }
        },
      },
    ]);
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  console.log("nav state routes:", navigation.getState()?.routeNames);
console.log("parent routes:", navigation.getParent()?.getState()?.routeNames);


  return (
    <View style={styles.container}>
      {/* Botão novo aluno */}
      <Pressable
        onPress={() =>
          navigation.getParent()?.navigate("StudentForm", { mode: "create" })
        }
        style={styles.primaryBtn}
      >
        <Ionicons name="person-add-outline" size={20} color="#fff" />
        <Text style={styles.primaryBtnText}>Novo aluno</Text>
      </Pressable>

      <Text style={styles.sub}>Total: {students.length}</Text>

      <FlatList
        data={visible}
        keyExtractor={(item, idx) =>
          String(item?._id ?? item?.id ?? idx)
        }
        contentContainerStyle={{ paddingVertical: 14 }}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        renderItem={({ item }) => {
          const id = item?._id || item?.id;

          return (
            <View style={styles.card}>
              <Text style={styles.title} numberOfLines={1}>
                {item.name}
              </Text>

              <Text style={styles.email} numberOfLines={1}>
                {item.email}
              </Text>

              <Text style={styles.disc}>
                {item.disciplinas?.join(", ") || "Sem disciplinas"}
              </Text>

              <View style={styles.row}>
                <Pressable
                  onPress={() =>
                    navigation.getParent()?.navigate("StudentForm", { mode: "edit", student: item })
                  }
                  style={styles.secondaryBtn}
                >
                  <Text style={styles.secondaryBtnText}>Editar</Text>
                </Pressable>

                <Pressable
                  onPress={() => handleDelete(id)}
                  style={styles.dangerBtn}
                >
                  <Text style={styles.dangerBtnText}>Excluir</Text>
                </Pressable>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum aluno encontrado.</Text>
        }
        ListFooterComponent={
          canLoadMore ? (
            <Pressable
              onPress={() => setPage((p) => p + 1)}
              style={styles.loadMoreBtn}
            >
              <Text style={styles.loadMoreText}>Carregar mais</Text>
            </Pressable>
          ) : (
            <View style={{ height: 10 }} />
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  sub: {
    marginTop: 10,
    color: colors.muted,
    ...typography.body,
  },

  primaryBtn: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    ...typography.bold,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
  },

  title: {
    fontSize: 16,
    color: colors.accent,
    ...typography.bold,
  },

  email: {
    marginTop: 4,
    color: colors.text,
    ...typography.body,
  },

  disc: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 13,
  },

  row: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },

  secondaryBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border ?? "#E5E7EB",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: colors.surface,
  },

  secondaryBtnText: {
    color: colors.text,
    ...typography.bold,
  },

  dangerBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#FEE2E2",
  },

  dangerBtnText: {
    color: colors.danger,
    ...typography.bold,
  },

  empty: {
    marginTop: 20,
    color: colors.muted,
    ...typography.body,
  },

  loadMoreBtn: {
    marginTop: 16,
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border ?? "#E5E7EB",
    backgroundColor: colors.surface,
  },

  loadMoreText: {
    color: colors.text,
    ...typography.bold,
  },
});
