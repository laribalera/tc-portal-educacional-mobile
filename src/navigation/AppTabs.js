import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import PostsStack from "./PostsStack";
import ManageStack from "./ManageStack";
import LoginScreen from "../screens/LoginScreen";
import AdminScreen from "../screens/AdminScreen";
import { useAuth } from "../context/AuthContext";

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  const { isLogged } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#111827",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: { borderTopWidth: 0, elevation: 8, height: 60 },
        tabBarIcon: ({ color }) => {
          let iconName = "ellipse-outline";

          if (route.name === "PostsTab") iconName = "document-text-outline";
          if (route.name === "LoginTab") iconName = "log-in-outline";
          if (route.name === "ManageTab") iconName = "create-outline";
          if (route.name === "AdminTab") iconName = "settings-outline";

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="PostsTab"
        component={PostsStack}
        options={{ title: "Posts" }}
      />

      {!isLogged ? (
        <Tab.Screen
          name="LoginTab"
          component={LoginScreen}
          options={{ title: "Login" }}
        />
      ) : (
        <>
          <Tab.Screen
            name="ManageTab"
            component={ManageStack}
            options={{ title: "Gerenciar" }}
          />
          <Tab.Screen
            name="AdminTab"
            component={AdminScreen}
            options={{ title: "Admin" }}
          />
        </>
      )}
    </Tab.Navigator>
  );
}
