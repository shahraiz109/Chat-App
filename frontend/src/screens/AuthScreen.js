import { useState } from "react";
import { View, StyleSheet } from "react-native";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";

export default function AuthScreen() {
  const [mode, setMode] = useState("login");
  const { login, signup, loading, error } = useAuth();

  const submit = (name, email, password) => {
    if (mode === "login") {
      login(email, password);
      return;
    }
    signup(name, email, password);
  };

  return (
    <View style={styles.container}>
      <AuthForm
        mode={mode}
        loading={loading}
        error={error}
        onSubmit={submit}
        onToggleMode={() => setMode((prev) => (prev === "login" ? "signup" : "login"))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    backgroundColor: "#f9fafb",
  },
});
