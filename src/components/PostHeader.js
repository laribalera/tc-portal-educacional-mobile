import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { typography, colors } from "../theme";


function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function PostHeader({ post }) {
  const titulo = post?.titulo || post?.title || "Sem título";
  const dataAtualizacao = formatDate(post?.updatedAt);

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{titulo}</Text>

      {!!dataAtualizacao && <Text style={styles.date}>Atualizado em {dataAtualizacao}</Text>}

      {!!post?.materia && <Text style={styles.materia}>Matéria: {post.materia}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6, marginBottom: 14 },
  title: { ...typography.h1, color: colors.accent, textAlign: "center" },
  date: { textAlign: "center", fontSize: 12, color: colors.secondary },
  materia: { textAlign: "center", fontSize: 14, fontWeight: "600", color: colors.accent },
});
