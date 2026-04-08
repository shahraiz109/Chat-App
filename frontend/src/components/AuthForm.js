import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function AuthForm({ mode, onSubmit, loading, error, onToggleMode }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const submit = () => {
    if (mode === "signup" && name.trim().length < 2) {
      setValidationError("Please enter your name");
      return;
    }
    if (!isEmail(email)) {
      setValidationError("Please enter a valid email");
      return;
    }
    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters");
      return;
    }
    setValidationError("");
    onSubmit(name.trim(), email.trim().toLowerCase(), password);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{mode === "login" ? "Login" : "Signup"}</Text>
      {mode === "signup" ? (
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
      ) : null}
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {validationError ? <Text style={styles.error}>{validationError}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={submit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onToggleMode}>
        <Text style={styles.link}>
          {mode === "login" ? "Need an account? Signup" : "Already have an account? Login"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", gap: 12 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 10, color: "#111827" },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  link: { color: "#2563eb", marginTop: 12, textAlign: "center", fontWeight: "600" },
  error: { color: "#b91c1c", fontSize: 14 },
});
