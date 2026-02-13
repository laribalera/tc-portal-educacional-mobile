import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AdminHomeScreen from "../screens/AdminHomeScreen";

import ProfessorFormScreen from "../screens/ProfessorFormScreen";
import StudentFormScreen from "../screens/StudentFormScreen";

const Stack = createNativeStackNavigator();

export default function AdminStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AdminHome"
        component={AdminHomeScreen}
        options={{ title: "Admin" }}
      />

      <Stack.Screen
        name="ProfessorForm"
        component={ProfessorFormScreen}
        options={({ route }) => ({
          title: route?.params?.mode === "edit" ? "Editar professor" : "Novo professor",
        })}
      />

      <Stack.Screen
        name="StudentForm"
        component={StudentFormScreen}
        options={({ route }) => ({
          title: route?.params?.mode === "edit" ? "Editar aluno" : "Novo aluno",
        })}
      />
    </Stack.Navigator>
  );
}
