import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PostsScreen from "../screens/PostsScreen";
import PostDetailsScreen from "../screens/PostDetailsScreen";

const Stack = createNativeStackNavigator();

export default function PostsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PostsList" component={PostsScreen} options={{ title: "Publicações" }} />
      <Stack.Screen name="PostDetails" component={PostDetailsScreen} options={{ headerShown: false }} />

    </Stack.Navigator>
  );
}
