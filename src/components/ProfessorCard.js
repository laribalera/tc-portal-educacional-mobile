import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography } from "../theme";

export default function ProfessorCard({ professor, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      <View style={{ gap: 4 }}>
        <Text style={styles.name} numberOfLines={1}>
          {professor?.name || "Sem nome"}
        </Text>
        <Text style={styles.email} numberOfLines={1}>
          {professor?.email || "Sem email"}
        </Text>
      </View>

      <View style={styles.row}>
        <Pressable onPress={onEdit} style={styles.iconBtn}>
          <Ionicons name="create-outline" size={18} color={colors.text} />
          <Text style={styles.iconBtnText}>Editar</Text>
        </Pressable>

        <Pressable onPress={onDelete} style={[styles.iconBtn, styles.dangerBtn]}>
          <Ionicons name="trash-outline" size={18} color={colors.danger} />
          <Text style={[styles.iconBtnText, { color: colors.danger }]}>Excluir</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  name: {
    fontSize: 16,
    color: colors.accent,
    ...typography.title,
  },
  email: {
    fontSize: 13,
    color: colors.muted,
    ...typography.body,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  iconBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border ?? "#E5E7EB",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  iconBtnText: {
    color: colors.text,
    ...typography.bold,
  },
  dangerBtn: {
    backgroundColor: "#FEE2E2",
    borderColor: "#FECACA",
  },
});
