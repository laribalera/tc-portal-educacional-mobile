import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { View, ActivityIndicator } from "react-native";
import AppTabs from "./AppTabs";
import { useAuth } from "../context/AuthContext";

export default function RootNavigator() {
  const { loadingAuth } = useAuth();

  if (loadingAuth) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AppTabs />
    </NavigationContainer>
  );
}
