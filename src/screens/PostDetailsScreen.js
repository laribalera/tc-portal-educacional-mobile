import React, { useEffect, useState } from "react";
import { Text, Alert, ScrollView, StyleSheet } from "react-native";
import { api } from "../services/api";

import Screen from "../components/Screen";
import Card from "../components/Card";
import PostHeader from "../components/PostHeader";
import LoadingCenter from "../components/LoadingCenter";
import TopBar from "../components/TopBar";

export default function PostDetailsScreen({ route, navigation }) {
  const { id } = route.params;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/posts/${id}`);
        const raw = data?.post ?? data;
        if (mounted) setPost(raw);
      } catch (err) {
        console.log("Erro details:", err?.response?.data || err?.message);
        Alert.alert("Erro", "Não consegui carregar o post.");
        if (mounted) setPost(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <LoadingCenter />;

  if (!post) {
    return (
      <Screen style={{ alignItems: "center", justifyContent: "center" }}>
        <Text>Post não encontrado.</Text>
      </Screen>
    );
  }

  const conteudo = post.conteudo || post.content || post.body || "";

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TopBar title="Post" onBack={() => navigation.goBack()} />

        <Card>
          <PostHeader post={post} />
          <Text style={styles.content}>{conteudo}</Text>
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 16,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: "#374151",
  },
});
