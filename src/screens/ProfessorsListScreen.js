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
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { api } from "../services/api";
import ProfessorCard from "../components/ProfessorCard";
import { colors, typography } from "../theme";

export default function ProfessorsListScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [professors, setProfessors] = useState([]);

  // paginação client-side
  const PAGE_SIZE = 8;
  const [page, setPage] = useState(1);

  async function load() {
    try {
      setLoading(true);
      const res = await api.get("/api/professores");
      const raw = res?.data;
      const list = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : []);
      setProfessors(list);
      setPage(1);
    } catch (e) {
      console.log("Erro professores:", e?.response?.data || e?.message);
      Alert.alert("Erro", "Não consegui carregar professores.");
      setProfessors([]);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const visible = useMemo(() => {
    return professors.slice(0, page * PAGE_SIZE);
  }, [professors, page]);

  const canLoadMore = visible.length < professors.length;

  async function handleDelete(id) {
    Alert.alert("Excluir", "Tem certeza que deseja excluir este professor?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/api/professores/${id}`);
            await load();
          } catch (e) {
            console.log("Erro delete professor:", e?.response?.data || e?.message);
            Alert.alert("Erro", "Não consegui excluir o professor.");
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

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Professores</Text>

        <Pressable
          onPress={() => navigation.navigate("ProfessorForm", { mode: "create" })}
          style={styles.primaryBtn}
        >
          <Ionicons name="person-add-outline" size={20} color="#fff" />
          <Text style={styles.primaryBtnText}>Novo</Text>
        </Pressable>
      </View>

      <Text style={styles.sub}>Total: {professors.length}</Text>

      <FlatList
        data={visible}
        keyExtractor={(item, idx) => String(item?._id ?? item?.id ?? idx)}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 24 }}
        renderItem={({ item }) => {
          const id = item?._id || item?.id;
          return (
            <ProfessorCard
              professor={item}
              onEdit={() => navigation.navigate("ProfessorForm", { mode: "edit", professor: item })}
              onDelete={() => handleDelete(id)}
            />
          );
        }}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum professor encontrado.</Text>
        }
        ListFooterComponent={
          canLoadMore ? (
            <Pressable onPress={() => setPage((p) => p + 1)} style={styles.loadMoreBtn}>
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
  container: { flex: 1, padding: 20, backgroundColor: colors.background },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  headerTitle: {
    fontSize: 18,
    color: colors.text,
    ...typography.title,
  },
  sub: {
    marginTop: 8,
    color: colors.muted,
    ...typography.body,
  },

  primaryBtn: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: colors.accent,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { color: "#fff", ...typography.bold },

  empty: { marginTop: 20, color: colors.muted, ...typography.body },

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
  loadMoreText: { color: colors.text, ...typography.bold },
});
