import React, { useEffect, useMemo, useState, useCallback } from "react";
import { View, Text, FlatList, Pressable, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";

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
            Alert.alert("Erro", "Não consegui deletar. Verifique se o backend tem DELETE /api/posts/:id.");
          }
        },
      },
    ]);
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => navigation.navigate("PostForm", { mode: "create" })}
        style={styles.primaryBtn}
      >
        <Text style={styles.primaryBtnText}>+ Novo post</Text>
      </Pressable>

      <FlatList
        data={myPosts}
        keyExtractor={(item, idx) => String(item?._id ?? idx)}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ paddingVertical: 12 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title} numberOfLines={2}>{item.titulo || "Sem título"}</Text>
            <Text style={styles.subtitle} numberOfLines={2}>{item.conteudo || ""}</Text>

            <View style={styles.row}>
              <Pressable
                onPress={() => navigation.navigate("PostForm", { mode: "edit", post: item })}
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
          <Text style={{ marginTop: 16, color: "#6B7280" }}>
            Você ainda não criou posts.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F3F4F6" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  primaryBtn: {
    backgroundColor: "#111827",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "700" },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 14 },
  title: { fontSize: 16, fontWeight: "800", color: "#111827" },
  subtitle: { marginTop: 6, color: "#6B7280" },
  row: { flexDirection: "row", gap: 10, marginTop: 12 },
  secondaryBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  secondaryBtnText: { fontWeight: "700", color: "#111827" },
  dangerBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#FEE2E2",
  },
  dangerBtnText: { fontWeight: "800", color: "#991B1B" },
});
