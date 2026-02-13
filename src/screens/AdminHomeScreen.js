import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { colors, typography } from "../theme";

import ProfessorsListScreen from "./ProfessorsListScreen";
import StudentsListScreen from "./StudentsListScreen";

const TopTab = createMaterialTopTabNavigator();

export default function AdminHomeScreen() {
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: 12,
          ...typography.bold,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarIndicatorStyle: {
          backgroundColor: colors.accent,
          height: 3,
          borderRadius: 3,
        },
        tabBarStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <TopTab.Screen
        name="AdminProfessors"
        component={ProfessorsListScreen}
        options={{ title: "Professores" }}
      />
      <TopTab.Screen
        name="AdminStudents"
        component={StudentsListScreen}
        options={{ title: "Alunos" }}
      />
    </TopTab.Navigator>
  );
}
