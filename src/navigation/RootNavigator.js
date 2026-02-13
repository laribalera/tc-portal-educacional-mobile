import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuth } from "../context/AuthContext";
import AppTabs from "./AppTabs";
import LoginScreen from "../screens/LoginScreen";
import LoadingCenter from "../components/LoadingCenter";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isLogged, loadingAuth } = useAuth();

  if (loadingAuth) {
    return <LoadingCenter />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLogged ? (
          // se não estiver logado, mostra a tela de login
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          // se estiver logado, mostra as telas do app
          <Stack.Screen name="App" component={AppTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
