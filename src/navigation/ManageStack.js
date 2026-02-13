import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ManagePostsScreen from "../screens/ManagePostsScreen";
import PostFormScreen from "../screens/PostFormScreen";

const Stack = createNativeStackNavigator();

export default function ManageStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ManagePosts" component={ManagePostsScreen} options={{ title: "Gerenciar Posts" }} />
      <Stack.Screen name="PostForm" component={PostFormScreen} options={{ title: "Post" }} />
    </Stack.Navigator>
  );
}
