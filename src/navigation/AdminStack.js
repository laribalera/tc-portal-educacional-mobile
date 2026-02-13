import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ProfessorsListScreen from "../screens/ProfessorsListScreen";
import ProfessorFormScreen from "../screens/ProfessorFormScreen";

const Stack = createNativeStackNavigator();

export default function AdminStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfessorsList"
        component={ProfessorsListScreen}
        options={{ title: "Admin" }}
      />
      <Stack.Screen
        name="ProfessorForm"
        component={ProfessorFormScreen}
        options={({ route }) => ({
          title: route?.params?.mode === "edit" ? "Editar professor" : "Novo professor",
        })}
      />
    </Stack.Navigator>
  );
}
