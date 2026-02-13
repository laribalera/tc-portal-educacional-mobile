import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

export default function LoadingCenter() {
  return (
    <View style={styles.center}>
      <ActivityIndicator />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
