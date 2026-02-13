import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import PostsStack from "./PostsStack";
import ManageStack from "./ManageStack";
import LoginScreen from "../screens/LoginScreen";
import AccountScreen from "../screens/AccountScreen";
import AdminStack from "./AdminStack";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme";

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  const auth = useAuth();

  const isLogged = !!auth?.isLogged;

  // preferir role 
  const role = auth?.role; // "aluno" | "professor" | "admin"

  // fallbacks
  const professor = auth?.professor;
  const aluno = auth?.aluno;

  const isStudent = role === "aluno" || (!!aluno && !professor);
  const isAdmin = role === "admin" || professor?.role === "admin";

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 8,
          height: 64,
          paddingBottom: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarIcon: ({ color }) => {
          let iconName = "ellipse-outline";

          if (route.name === "PostsTab") iconName = "document-text-outline";
          if (route.name === "LoginTab") iconName = "log-in-outline";
          if (route.name === "ManageTab") iconName = "create-outline";
          if (route.name === "AdminTab") iconName = "shield-checkmark-outline";
          if (route.name === "AccountTab") iconName = "person-outline";

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      {/* Sempre visível */}
      <Tab.Screen
        name="PostsTab"
        component={PostsStack}
        options={{ title: "Posts" }}
      />

      {/* Se NÃO estiver logado */}
      {!isLogged && (
        <Tab.Screen
          name="LoginTab"
          component={LoginScreen}
          options={{ title: "Login" }}
        />
      )}

      {/* Se estiver logado e NÃO for aluno (professor) */}
      {isLogged && !isStudent && (
        <>
          <Tab.Screen
            name="ManageTab"
            component={ManageStack}
            options={{ title: "Dashboard" }}
          />

          {/* Apenas Admin vê */}
          {isAdmin && (
            <Tab.Screen
              name="AdminTab"
              component={AdminStack}
              options={{ title: "Admin" }}
            />
          )}
        </>
      )}

      {/* Conta sempre visível */}
      <Tab.Screen
        name="AccountTab"
        component={AccountScreen}
        options={{
          title: "Conta",
          headerShown: true,
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          headerTintColor: colors.text,
        }}
      />
    </Tab.Navigator>
  );
}
