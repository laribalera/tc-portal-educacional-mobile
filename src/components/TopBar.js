import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function TopBar({ title = "", onBack }) {
  return (
    <View style={styles.topBar}>
      <Pressable onPress={onBack} hitSlop={12}>
        <Text style={styles.back}>‹ Voltar</Text>
      </Pressable>

      <Text style={styles.topTitle} numberOfLines={1}>
        {title}
      </Text>

      <View style={{ width: 60 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  back: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "600",
    width: 60,
  },
  topTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
});
