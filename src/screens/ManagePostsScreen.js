import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { colors, typography } from "../theme";

export default function ManagePostsScreen({ navigation }) {
  const { professor } = useAuth();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  async function load() {
    try {
      setLoading(true);
      const { data } = await api.get("/api/posts");
      const raw = data?.posts ?? data;
      const list = Array.isArray(raw) ? raw : [];
      setPosts(list);
    } catch (e) {
      console.log("Erro manage posts:", e?.response?.data || e?.message);
      Alert.alert("Erro", "Não consegui carregar seus posts.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const myPosts = useMemo(() => {
    const myId = professor?._id || professor?.id;
    if (!myId) return [];

    return posts.filter((p) => {
      const authorId = p?.autor?._id || p?.autor?.id || p?.autor;
      return String(authorId) === String(myId);
    });
  }, [posts, professor]);

  async function handleDelete(postId) {
    Alert.alert("Deletar", "Tem certeza que deseja deletar este post?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Deletar",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/api/posts/${postId}`);
            await load();
          } catch (e) {
            console.log("Erro delete:", e?.response?.data || e?.message);
            Alert.alert("Erro", "Não foi possível deletar o post.");
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
      {/* Botão Novo Post */}
      <Pressable
        onPress={() => navigation.navigate("PostForm", { mode: "create" })}
        style={styles.primaryBtn}
      >
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text style={styles.primaryBtnText}>Novo post</Text>
      </Pressable>

      <FlatList
        data={myPosts}
        keyExtractor={(item, idx) => String(item?._id ?? idx)}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        contentContainerStyle={{ paddingVertical: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title} numberOfLines={2}>
              {item.titulo || "Sem título"}
            </Text>

            <Text style={styles.subtitle} numberOfLines={2}>
              {item.conteudo || ""}
            </Text>

            <View style={styles.row}>
              <Pressable
                onPress={() =>
                  navigation.navigate("PostForm", { mode: "edit", post: item })
                }
                style={styles.secondaryBtn}
              >
                <Text style={styles.secondaryBtnText}>Editar</Text>
              </Pressable>

              <Pressable
                onPress={() => handleDelete(item._id)}
                style={styles.dangerBtn}
              >
                <Text style={styles.dangerBtnText}>Deletar</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Você ainda não criou posts.
          </Text>
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

  /* ---------- BOTÃO PRINCIPAL ---------- */
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

  /* ---------- CARD ---------- */
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
  },

  title: {
    fontSize: 18,
    color: colors.accent,
    marginBottom: 6,
    ...typography.title,
  },

  subtitle: {
    color: colors.muted,
    fontSize: 14,
    ...typography.body,
  },

  row: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },

  secondaryBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },

  secondaryBtnText: {
    ...typography.bold,
    color: colors.text,
  },

  dangerBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#FEE2E2",
  },

  dangerBtnText: {
    ...typography.bold,
    color: colors.danger,
  },

  emptyText: {
    marginTop: 24,
    textAlign: "center",
    color: colors.muted,
    ...typography.body,
  },
});
