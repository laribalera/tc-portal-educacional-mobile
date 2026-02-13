import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const { signIn, isLogged, signOut, professor } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    try {
      setLoading(true);
      await signIn(email, password);

      navigation.navigate("PostsTab");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Erro no login";
      Alert.alert("Login", msg);
    } finally {
      setLoading(false);
    }
  }


  if (isLogged) {
    return (
      <View style={{ padding: 16, gap: 12 }}>
        <Text>
          {professor?.name ? `Professor(a): ${professor.name}` : professor?.email || ""}
        </Text>

        <Button title="Ir para Posts" onPress={() => navigation.navigate("PostsTab")} />
        <Button title="Ir para Admin" onPress={() => navigation.navigate("AdminTab")} />
        <Button title="Sair" onPress={signOut} />
      </View>
    );
  }

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>Entrar</Text>

      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
      />

      <Text>Senha</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
      />

      <Button
        title={loading ? "Entrando..." : "Entrar"}
        onPress={handleLogin}
        disabled={loading}
      />
    </View>
  );
}
