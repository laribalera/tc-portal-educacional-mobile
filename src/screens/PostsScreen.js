import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { api } from "../services/api";
import PostCard from "../components/PostCard";

export default function PostsScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      const { data } = await api.get("/api/posts");

      const raw = data;
      const list =
        Array.isArray(raw) ? raw :
        Array.isArray(raw?.posts) ? raw.posts :
        Array.isArray(raw?.data) ? raw.data :
        [];

      setPosts(list);
    } catch (err) {
      console.log("Erro posts:", err?.response?.data || err?.message);
      Alert.alert("Erro", "Não consegui buscar os posts.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      <Text style={styles.sub}>Total de posts: {posts.length}</Text>

      <FlatList
        data={posts}
        keyExtractor={(item, index) => String(item?._id ?? item?.id ?? index)}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onPress={() => navigation.navigate("PostDetails", { id: item._id })}
          />
        )}
        ListEmptyComponent={<Text style={{ marginTop: 16 }}>Nenhum post encontrado.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F9FAFB" },
  h1: { fontSize: 24, fontWeight: "700", color: "#111827" },
  sub: { marginTop: 4, marginBottom: 12, color: "#6B7280" },
  listContent: { paddingBottom: 16 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

});
