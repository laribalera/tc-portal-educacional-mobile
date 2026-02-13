import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Dimensions } from "react-native";

import { typography, colors } from "../theme";

const { height } = Dimensions.get("window");

export default function PostCard({ post, onPress }) {
  const titulo = post?.titulo || post?.title || "Sem título";
  const conteudo = post?.conteudo || post?.content || post?.body || "";
  const materia = post?.materia || "";
  const autor = post?.autor?.name || post?.autor?.nome || "";

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>
          {titulo}
        </Text>
      </View>

      {(materia || autor) ? (
        <View style={styles.metaRow}>
          {!!materia && <Text style={styles.badge}>{materia}</Text>}
          {!!autor && <Text style={styles.metaText} numberOfLines={1}>por {autor}</Text>}
        </View>
      ) : null}

      <Text style={styles.content} numberOfLines={3}>
        {conteudo}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 14,
    backgroundColor: "#FFFFFF",
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  header: {
    marginBottom: 8,
  },
  title: { 
    ...typography.h1, 
    color: colors.accent,
   },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(123, 30, 58, 0.1)",
    color: "#7b1e3a",
    fontSize: 14,
    fontWeight: "600",
    overflow: "hidden",
  },
  metaText: {
    fontSize: 14,
    color: "#6B7280",
    flexShrink: 1,
  },
  content: {
    fontSize: 18,
    letterSpacing: 0.27,
    color: "#374151",
    lineHeight: 27,
  },
});
